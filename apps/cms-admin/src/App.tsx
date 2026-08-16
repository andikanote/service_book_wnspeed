/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppRole, AdminTab, RacerTab, Booking, InventoryItem } from './types';
import { INITIAL_BOOKINGS, INITIAL_INVENTORY } from './data/mockData';

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
import { RacerDiagnostics } from './components/racer/RacerDiagnostics';
import { RacerBookings } from './components/racer/RacerBookings';
import { RacerMembership } from './components/racer/RacerMembership';
import { RacerProfile } from './components/racer/RacerProfile';
import { EmergencySupportModal } from './components/racer/EmergencySupportModal';

import { HelpCircle, PhoneCall, X } from 'lucide-react';

export default function App() {
  // Authentication state: null means on Login page
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [racerTab, setRacerTab] = useState<RacerTab>('dashboard');
  
  // App Shared State
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Auth Handlers
  const handleLogin = (role: AppRole, email?: string) => {
    setCurrentUserRole(role);
    if (email) setCurrentUserEmail(email);
    // Reset tabs
    if (role === 'admin') {
      setAdminTab('overview');
    } else {
      setRacerTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentUserEmail('');
  };

  // Handlers
  const handleUpdateBookingStatus = (id: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  };

  const handleRestockItem = (id: string, amount: number) => {
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
  };

  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory([newItem, ...inventory]);
  };

  // If not logged in, render the Login screen
  if (!currentUserRole) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased">
      {/* Role 1: ART N SPEED Admin CMS */}
      {currentUserRole === 'admin' && (
        <div className="flex flex-1 min-h-screen">
          {/* Admin Sidebar */}
          <AdminSidebar
            currentTab={adminTab}
            onTabChange={setAdminTab}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Admin Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
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
              onOpenProfile={() => setAdminTab('users')}
              onOpenHelp={() => setIsHelpModalOpen(true)}
            />

            <main className="flex-1 overflow-y-auto">
              {adminTab === 'overview' && (
                <AdminDashboard
                  onNavigateTab={setAdminTab}
                  onOpenReport={() => setIsReportModalOpen(true)}
                  onQuickAddBooking={() => setAdminTab('bookings')}
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
          </div>
        </div>
      )}

      {/* Role 2: GARAGE_OS Racer Portal */}
      {currentUserRole === 'racer' && (
        <div className="flex flex-1 min-h-screen">
          {/* Racer Sidebar */}
          <RacerSidebar
            currentTab={racerTab}
            onTabChange={setRacerTab}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Racer Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 overflow-y-auto">
              {racerTab === 'dashboard' && (
                <RacerDashboard onNavigateTab={setRacerTab} />
              )}
              {racerTab === 'diagnostics' && <RacerDiagnostics />}
              {racerTab === 'bookings' && <RacerBookings />}
              {racerTab === 'membership' && <RacerMembership />}
              {racerTab === 'profile' && <RacerProfile />}
            </main>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                ART N SPEED CMS Documentation
              </h3>
              <button onClick={() => setIsHelpModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-slate-600">
              <p>
                Welcome to <strong className="text-slate-900">ART N SPEED Precision Workshop CMS</strong>. This software coordinates workshop bays, live telemetry from client motorcycles, inventory replenishment, and customer loyalty rewards.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
                <p>• <strong>Overview:</strong> High-level financial KPIs, active bays, and critical restock warnings.</p>
                <p>• <strong>Bookings:</strong> View and transition customer reservations from Pending to Completed.</p>
                <p>• <strong>Inventory:</strong> Real-time spare parts stock tracking with instant purchase orders.</p>
                <p>• <strong>Users & CRM:</strong> Customer database, racing telemetry records, and loyalty tiers.</p>
              </div>
            </div>
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase shadow-xs transition cursor-pointer"
            >
              Close Manual
            </button>
          </div>
        </div>
      )}

      {/* Admin Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                Workshop Technical Desk
              </h3>
              <button onClick={() => setIsSupportModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-slate-600">
              <p>For urgent system issues, Dyno hardware link failures, or cloud sync errors:</p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                <p><strong>Hotline:</strong> 021-8899-SPEED (021-8899-7733)</p>
                <p><strong>WhatsApp:</strong> +62 812-9900-8800</p>
                <p><strong>Email:</strong> support@artnspeed.id</p>
              </div>
            </div>
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase shadow-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
