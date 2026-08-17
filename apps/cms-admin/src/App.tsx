/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppRole, AdminTab, RacerTab, Booking, InventoryItem } from './types';
import { apiClient } from './services/api';

// Auth
import { LoginView } from './components/auth/LoginView';

// Admin Components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminBookings } from './components/admin/AdminBookings';
import { AdminServices } from './components/admin/AdminServices';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminSettings } from './components/admin/AdminSettings';
import { GenerateReportModal } from './components/admin/GenerateReportModal';

// Racer Components
import { RacerSidebar } from './components/racer/RacerSidebar';
import { RacerDashboard } from './components/racer/RacerDashboard';
import { RacerBikes } from './components/racer/RacerBikes';
import { RacerBookings } from './components/racer/RacerBookings';
import { RacerMembership } from './components/racer/RacerMembership';
import { RacerProfile } from './components/racer/RacerProfile';
import { EmergencySupportModal } from './components/racer/EmergencySupportModal';
import { RoleSwitcher } from './components/common/RoleSwitcher';

import { HelpCircle, PhoneCall, X } from 'lucide-react';

function getInitialRole(): AppRole | null {
  if (typeof window === 'undefined') return 'admin';
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) {
    path = hash.replace(/^#/, '');
  }

  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/racer')) return 'racer';
  if (path === '/login') return null;

  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === 'admin' || parsed.role === 'racer') {
        return parsed.role;
      }
    }
    const token = localStorage.getItem('access_token');
    if (token) return 'admin';
  } catch (e) {
    // Ignore JSON parse errors
  }

  return 'admin';
}

function getInitialAdminTab(): AdminTab {
  if (typeof window === 'undefined') return 'overview';
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) path = hash.replace(/^#/, '');

  if (path.includes('/booking')) return 'bookings';
  if (path.includes('/service')) return 'services';
  if (path.includes('/inventory') || path.includes('/spare')) return 'inventory';
  if (path.includes('/user') || path.includes('/crm')) return 'users';
  if (path.includes('/setting')) return 'settings';
  return 'overview';
}

function getInitialRacerTab(): RacerTab {
  if (typeof window === 'undefined') return 'dashboard';
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) path = hash.replace(/^#/, '');

  if (path.includes('/bike') || path.includes('/motor') || path.includes('/garage')) return 'bikes';
  if (path.includes('/booking')) return 'bookings';
  if (path.includes('/member') || path.includes('/reward')) return 'membership';
  if (path.includes('/profile') || path.includes('/account')) return 'profile';
  return 'dashboard';
}

export default function App() {
  // Synchronous state initialization prevents any screen flicker/glitch on page reload
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(getInitialRole);
  const [, setCurrentUserEmail] = useState<string>('');

  const [adminTab, setAdminTabState] = useState<AdminTab>(getInitialAdminTab);
  const [racerTab, setRacerTabState] = useState<RacerTab>(getInitialRacerTab);
  
  // App Shared State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Fetch live bookings and inventory from backend API on mount / role change
  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const [bookingsRes, invRes] = await Promise.allSettled([
          apiClient.get('/bookings'),
          apiClient.get('/inventory'),
        ]);

        if (bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value) && bookingsRes.value.length > 0) {
          const mapped = bookingsRes.value.map((b: any) => ({
            id: b.id,
            customerName: b.user?.name || b.customerName || 'Customer',
            customerPhone: b.user?.phone || b.customerPhone || '-',
            bikeModel: b.bike?.model || b.bikeModel || 'Motor Matic',
            plateNumber: b.bike?.plateNumber || b.plateNumber || 'B 1234 XXX',
            servicePackage: b.service?.name || b.servicePackage || 'General Service',
            bookingDate: b.bookingDate ? new Date(b.bookingDate).toISOString().slice(0, 10) : '2026-08-17',
            time: b.bookingTime || b.time || '10:00 AM',
            status: b.status || 'PENDING',
            bayNumber: b.bayNumber,
            assignedMechanic: b.assignedMechanic || b.mechanic || 'Chief Tech',
            estimatedCost: Number(b.totalCost || b.estimatedCost || 0),
            notes: b.notes,
            branch: b.branch || 'Bekasi Branch',
          }));
          setBookings(mapped);
        }

        if (invRes.status === 'fulfilled' && Array.isArray(invRes.value) && invRes.value.length > 0) {
          setInventory(invRes.value.map((i: any) => ({
            id: i.id,
            sku: i.sku,
            name: i.name,
            category: i.category,
            stock: i.stock,
            minThreshold: i.minThreshold,
            price: Number(i.price),
            supplier: i.supplier || '',
            location: i.location || 'Rack A-01',
            status: i.status === 'Critical_Out' || i.status === 'Critical Out' ? 'Critical Out' : i.status === 'Low_Stock' || i.status === 'Low Stock' ? 'Low Stock' : 'In Stock',
          })));
        }
      } catch (err) {
        console.warn('Could not load shared data from backend:', err);
      }
    };

    fetchSharedData();
  }, [currentUserRole]);

  // Sync state with browser location (back/forward history and URL loads)
  useEffect(() => {
    const handleLocationChange = () => {
      let path = window.location.pathname.toLowerCase().trim();
      const hash = window.location.hash.toLowerCase().trim();

      if (hash.startsWith('#/')) {
        const cleanPath = hash.replace(/^#/, '');
        window.history.replaceState(null, '', cleanPath);
        path = cleanPath;
      }

      if (path.startsWith('/admin')) {
        setCurrentUserRole('admin');
        if (path.includes('/booking')) setAdminTabState('bookings');
        else if (path.includes('/service')) setAdminTabState('services');
        else if (path.includes('/inventory') || path.includes('/spare')) setAdminTabState('inventory');
        else if (path.includes('/user') || path.includes('/crm')) setAdminTabState('users');
        else if (path.includes('/setting')) setAdminTabState('settings');
        else setAdminTabState('overview');
      } else if (path.startsWith('/racer')) {
        setCurrentUserRole('racer');
        if (path.includes('/bike') || path.includes('/motor') || path.includes('/garage')) setRacerTabState('bikes');
        else if (path.includes('/booking')) setRacerTabState('bookings');
        else if (path.includes('/member') || path.includes('/reward')) setRacerTabState('membership');
        else if (path.includes('/profile') || path.includes('/account')) setRacerTabState('profile');
        else setRacerTabState('dashboard');
      } else if (path === '/login') {
        setCurrentUserRole(null);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Tab change handlers that also update clean URL path
  const handleAdminTabChange = (tab: AdminTab) => {
    setAdminTabState(tab);
    window.history.pushState(null, '', `/admin/${tab}`);
  };

  const handleRacerTabChange = (tab: RacerTab) => {
    setRacerTabState(tab);
    window.history.pushState(null, '', `/racer/${tab}`);
  };

  const handleRoleChange = (newRole: AppRole) => {
    setCurrentUserRole(newRole);
    if (newRole === 'admin') {
      window.history.pushState(null, '', `/admin/${adminTab}`);
    } else {
      window.history.pushState(null, '', `/racer/${racerTab}`);
    }
  };

  // Auth Handlers
  const handleLogin = (role: AppRole, email?: string) => {
    setCurrentUserRole(role);
    if (email) setCurrentUserEmail(email);
    if (role === 'admin') {
      setAdminTabState('overview');
      window.history.pushState(null, '', '/admin/overview');
    } else {
      setRacerTabState('dashboard');
      window.history.pushState(null, '', '/racer/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setCurrentUserRole(null);
    setCurrentUserEmail('');
    window.history.pushState(null, '', '/login');
  };

  // Handlers with Live Backend API Sync
  const handleUpdateBookingStatus = async (id: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await apiClient.patch(`/bookings/${id}/status`, { status: newStatus });
    } catch (e) {
      console.warn('Could not sync booking status to backend:', e);
    }
  };

  const handleAddBooking = async (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    try {
      await apiClient.post('/bookings', {
        branch: newBooking.branch,
        bookingDate: newBooking.bookingDate,
        bookingTime: newBooking.time,
        notes: newBooking.notes,
        totalCost: newBooking.estimatedCost,
      });
    } catch (e) {
      console.warn('Could not sync new booking to backend:', e);
    }
  };

  const handleRestockItem = async (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = item.stock + amount;
          return {
            ...item,
            stock: newStock,
            status: newStock <= item.minThreshold ? 'Low Stock' : 'In Stock',
          };
        }
        return item;
      })
    );
    try {
      await apiClient.patch(`/inventory/${id}/stock`, { amount, action: 'add' });
    } catch (e) {
      console.warn('Could not sync inventory restock to backend:', e);
    }
  };

  const handleAddInventoryItem = async (newItem: InventoryItem) => {
    setInventory([newItem, ...inventory]);
    try {
      await apiClient.post('/inventory', newItem);
    } catch (e) {
      console.warn('Could not save inventory item to backend:', e);
    }
  };

  // If not logged in, render the Login screen
  if (!currentUserRole) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col antialiased font-sans">
      {/* Role 1: WE N SPEED Admin CMS */}
      {currentUserRole === 'admin' && (
        <div className="flex flex-1 min-h-screen">
          {/* Admin Sidebar */}
          <AdminSidebar
            currentTab={adminTab}
            onTabChange={handleAdminTabChange}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Admin Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#131313]">
            <AdminHeader
              title={
                adminTab === 'overview'
                  ? 'Admin Dashboard'
                  : adminTab === 'bookings'
                  ? 'Bookings Management'
                  : adminTab === 'services'
                  ? 'Service Catalog'
                  : adminTab === 'inventory'
                  ? 'Inventory & Spares'
                  : adminTab === 'users'
                  ? 'Racer CRM'
                  : 'System Settings'
              }
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenProfile={() => handleAdminTabChange('users')}
              onOpenHelp={() => setIsHelpModalOpen(true)}
            />

            <main className="flex-1 overflow-y-auto bg-[#131313]">
              {adminTab === 'overview' && (
                <AdminDashboard
                  onNavigateTab={handleAdminTabChange}
                  onOpenReport={() => setIsReportModalOpen(true)}
                  onQuickAddBooking={() => handleAdminTabChange('bookings')}
                  bookings={bookings}
                  inventory={inventory}
                />
              )}
              {adminTab === 'bookings' && (
                <AdminBookings
                  bookings={bookings}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onAddBooking={handleAddBooking}
                />
              )}
              {adminTab === 'services' && <AdminServices />}
              {adminTab === 'inventory' && (
                <AdminInventory
                  inventory={inventory}
                  onRestockItem={handleRestockItem}
                  onAddItem={handleAddInventoryItem}
                />
              )}
              {adminTab === 'users' && <AdminUsers />}
              {adminTab === 'settings' && <AdminSettings />}
            </main>

            {/* Admin Footer */}
            <footer className="border-t border-[#1E293B] px-6 py-4 text-center text-xs font-mono text-[#cec6ab] flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#131313]">
              <p>&copy; {new Date().getFullYear()} WE N SPEED Precision Engineering. All rights reserved.</p>
              <div className="flex items-center gap-4 text-[#cec6ab]">
                <span className="text-[#CCFF00]">Workshop Dyno Link: ACTIVE</span>
                <span>•</span>
                <span>Security Protocol TLS 1.3</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Role 2: GARAGE_OS Racer Portal */}
      {currentUserRole === 'racer' && (
        <div className="flex flex-1 min-h-screen">
          {/* Racer Sidebar */}
          <RacerSidebar
            currentTab={racerTab}
            onTabChange={handleRacerTabChange}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Racer Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#131313]">
            <main className="flex-1 overflow-y-auto bg-[#131313]">
              {racerTab === 'dashboard' && (
                <RacerDashboard onNavigateTab={handleRacerTabChange} />
              )}
              {racerTab === 'bikes' && (
                <RacerBikes
                  onNavigateToBooking={() => handleRacerTabChange('bookings')}
                />
              )}
              {racerTab === 'bookings' && <RacerBookings />}
              {racerTab === 'membership' && <RacerMembership />}
              {racerTab === 'profile' && <RacerProfile />}
            </main>

            {/* Racer Footer */}
            <footer className="border-t border-[#1E293B] px-6 py-4 text-center text-xs font-mono text-[#cec6ab] flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#131313]">
              <p>&copy; {new Date().getFullYear()} WE N SPEED Precision Engineering. All rights reserved.</p>
              <div className="flex items-center gap-4 text-[#cec6ab]">
                <span className="text-[#CCFF00]">Workshop Dyno Link: ACTIVE</span>
                <span>•</span>
                <span>Security Protocol TLS 1.3</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Role Switcher floating widget */}
      <RoleSwitcher
        currentRole={currentUserRole}
        onChangeRole={handleRoleChange}
      />

      {/* Generate Report Modal for Admin */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Emergency Support Modal for Racer */}
      <EmergencySupportModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Admin Help / Manual Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-lg p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] text-sm flex items-center gap-2 font-display uppercase">
                <HelpCircle className="w-4 h-4 text-[#FFE01B]" />
                WE N SPEED CMS Documentation
              </h3>
              <button onClick={() => setIsHelpModalOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-[#cec6ab]">
              <p>
                Welcome to <strong className="text-white">WE N SPEED Precision Workshop CMS</strong>. This software coordinates workshop bays, live telemetry from client motorcycles, inventory replenishment, and customer loyalty rewards.
              </p>
              <div className="p-3 bg-[#131313] rounded border border-[#1E293B] space-y-1.5 text-[11px] font-mono">
                <p>• <strong className="text-[#FFE01B]">Overview:</strong> High-level financial KPIs, active bays, and critical restock warnings.</p>
                <p>• <strong className="text-[#FFE01B]">Bookings:</strong> View and transition customer reservations from Pending to Completed.</p>
                <p>• <strong className="text-[#FFE01B]">Inventory:</strong> Real-time spare parts stock tracking with instant purchase orders.</p>
                <p>• <strong className="text-[#FFE01B]">Users & CRM:</strong> Customer database, racing telemetry records, and loyalty tiers.</p>
              </div>
            </div>
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold font-mono rounded uppercase shadow-md shadow-[#FFE01B]/20 transition cursor-pointer"
            >
              Close Manual
            </button>
          </div>
        </div>
      )}

      {/* Admin Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1c1b1b] border border-[#1E293B] rounded w-full max-w-md p-6 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-[#e5e2e1] text-sm flex items-center gap-2 font-display uppercase">
                <PhoneCall className="w-4 h-4 text-[#FFE01B]" />
                Workshop Technical Desk
              </h3>
              <button onClick={() => setIsSupportModalOpen(false)} className="text-[#cec6ab] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-[#cec6ab]">
              <p>For urgent system issues, Dyno hardware link failures, or cloud sync errors:</p>
              <div className="p-3 bg-[#131313] rounded border border-[#1E293B] space-y-1 text-[#e5e2e1] font-mono">
                <p><strong>Hotline:</strong> 021-8899-SPEED (021-8899-7733)</p>
                <p><strong>WhatsApp:</strong> +62 812-9900-8800</p>
                <p><strong>Email:</strong> support@wenspeed.my.id</p>
              </div>
            </div>
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="w-full py-2.5 bg-[#FFE01B] hover:bg-[#ffe241] text-black font-bold font-mono rounded uppercase shadow-md shadow-[#FFE01B]/20 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
