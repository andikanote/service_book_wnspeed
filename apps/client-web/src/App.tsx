import React, { useState, useEffect } from 'react';

import { AppRole, AdminTab, RacerTab, Booking, InventoryItem } from './types';
import { ServicePackage, SERVICE_PACKAGES } from './data/workshopData';
import { runGeminiDiagnosis, DiagnosisResult } from './services/aiDiagnosis';

// Client Web Components
import { HeaderNav } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { DigitalDiagnosisCard } from './components/DigitalDiagnosisCard';
import { ServicePackages } from './components/ServicePackages';
import { BookingFlow } from './components/BookingFlow';
import { LandingPage } from './components/LandingPage';
import { TelemetryView } from './components/TelemetryView';
import { MembershipView } from './components/MembershipView';
import { Footer } from './components/Footer';
import { DiagnosisResultModal } from './components/DiagnosisResultModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { ArticleModal } from './components/ArticleModal';

// Auth Component
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

// Icons
import { HelpCircle, PhoneCall, X } from 'lucide-react';

function getInitialClientSection(): 'public' | 'login' | 'admin' | 'racer' {
  if (typeof window === 'undefined') return 'public';
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) path = hash.replace(/^#/, '');

  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/racer')) return 'racer';
  if (path.startsWith('/login') || path.startsWith('/masuk')) return 'login';
  return 'public';
}

function getInitialPublicView(): 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership' {
  if (typeof window === 'undefined') return 'landing';
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) path = hash.replace(/^#/, '');

  if (path.startsWith('/services') || path.startsWith('/dashboard') || path.startsWith('/service')) return 'dashboard';
  if (path.startsWith('/booking')) return 'booking';
  if (path.startsWith('/telemetry')) return 'telemetry';
  if (path.startsWith('/membership')) return 'membership';
  return 'landing';
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
  if (path.includes('/membership') || path.includes('/reward')) return 'membership';
  if (path.includes('/profile') || path.includes('/account')) return 'profile';
  return 'dashboard';
}

function getInitialClientRole(): AppRole | null {
  if (typeof window === 'undefined') return null;
  let path = window.location.pathname.toLowerCase().trim();
  const hash = window.location.hash.toLowerCase().trim();
  if (hash.startsWith('#/')) path = hash.replace(/^#/, '');

  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/racer')) return 'racer';

  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === 'admin' || parsed.role === 'racer') return parsed.role;
    }
  } catch (e) {}
  return null;
}

export function App() {
  // Top-level Section: 'public' | 'login' | 'admin' | 'racer'
  const [activeSection, setActiveSection] = useState<'public' | 'login' | 'admin' | 'racer'>(getInitialClientSection);

  // Client Web Sub-view: 'landing' (Default for http://localhost:3000/) | 'dashboard' | 'booking' | 'telemetry' | 'membership'
  const [publicView, setPublicView] = useState<'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership'>(getInitialPublicView);
  const [sidebarTab, setSidebarTab] = useState<'diagnostics' | 'services' | 'performance' | 'garage' | 'support'>('services');

  // Admin & Racer Sub-tabs
  const [adminTab, setAdminTab] = useState<AdminTab>(getInitialAdminTab);
  const [racerTab, setRacerTab] = useState<RacerTab>(getInitialRacerTab);

  // Authentication State
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(getInitialClientRole);
  const [, setCurrentUserEmail] = useState<string>('');

  // Selected Service Package for Client Web booking flow
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(SERVICE_PACKAGES[1]);

  // Shared Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Client Web Modals
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisContext, setDiagnosisContext] = useState<{ brand: string; model: string; symptoms: string[] }>({
    brand: 'YAMAHA',
    model: 'NMAX 155 Connected',
    symptoms: ['brebet', 'gredeg'],
  });
  const [showDiagnosisModal, setShowDiagnosisModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeArticle, setActiveArticle] = useState<any>(null);

  // Admin & Racer Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Sync state with URL Path (and legacy Hash) on load & popstate/hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      let path = window.location.pathname.toLowerCase().trim();
      const hash = window.location.hash.toLowerCase().trim();

      // If user navigated with legacy hash like #/admin/services, migrate to clean path
      if (hash.startsWith('#/')) {
        const cleanPath = hash.replace(/^#/, '');
        window.history.replaceState(null, '', cleanPath);
        path = cleanPath;
      }

      // 1. Admin Sub-page Routing (e.g. /admin/services, /admin/bookings, etc.)
      if (path.startsWith('/admin')) {
        setActiveSection('admin');
        setCurrentUserRole('admin');

        if (path.includes('/booking')) {
          setAdminTab('bookings');
        } else if (path.includes('/service')) {
          setAdminTab('services');
        } else if (path.includes('/inventory') || path.includes('/spare')) {
          setAdminTab('inventory');
        } else if (path.includes('/user') || path.includes('/crm')) {
          setAdminTab('users');
        } else if (path.includes('/setting')) {
          setAdminTab('settings');
        } else {
          setAdminTab('overview');
        }
      } 
      // 2. Racer Sub-page Routing (e.g. /racer/bikes, /racer/bookings, etc.)
      else if (path.startsWith('/racer')) {
        setActiveSection('racer');
        setCurrentUserRole('racer');

        if (path.includes('/bike') || path.includes('/motor') || path.includes('/garage')) {
          setRacerTab('bikes');
        } else if (path.includes('/booking')) {
          setRacerTab('bookings');
        } else if (path.includes('/membership')) {
          setRacerTab('membership');
        } else if (path.includes('/profile')) {
          setRacerTab('profile');
        } else {
          setRacerTab('dashboard');
        }
      } 
      // 3. Auth Route
      else if (path.startsWith('/login') || path.startsWith('/masuk')) {
        setActiveSection('login');
      } 
      // 4. Public Web Routes
      else if (path.startsWith('/services') || path.startsWith('/dashboard') || path.startsWith('/service')) {
        setActiveSection('public');
        setPublicView('dashboard');
      } else if (path.startsWith('/booking')) {
        setActiveSection('public');
        setPublicView('booking');
      } else if (path.startsWith('/telemetry')) {
        setActiveSection('public');
        setPublicView('telemetry');
      } else if (path.startsWith('/membership')) {
        setActiveSection('public');
        setPublicView('membership');
      } else {
        // Default root http://localhost:3000/ -> Landing Page
        setActiveSection('public');
        setPublicView('landing');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Public Navigation Handler with clean URL Path
  const handlePublicNavigate = (view: 'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership') => {
    setActiveSection('public');
    setPublicView(view);
    const targetPath = view === 'landing' ? '/' : `/${view}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Tab Navigation Handler with clean URL Path update
  const handleAdminTabChange = (tab: AdminTab) => {
    setAdminTab(tab);
    const targetPath = `/admin/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Racer Tab Navigation Handler with clean URL Path update
  const handleRacerTabChange = (tab: RacerTab) => {
    setRacerTab(tab);
    const targetPath = `/racer/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLogin = (role: AppRole, email?: string) => {
    setCurrentUserRole(role);
    if (email) setCurrentUserEmail(email);
    if (role === 'admin') {
      setActiveSection('admin');
      setAdminTab('overview');
      window.history.pushState(null, '', '/admin/overview');
    } else {
      setActiveSection('racer');
      setRacerTab('dashboard');
      window.history.pushState(null, '', '/racer/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setCurrentUserRole(null);
    setCurrentUserEmail('');
    setActiveSection('login');
    window.history.pushState(null, '', '/login');
  };

  // Diagnosis runner
  const handleRunDiagnosis = async (brand: string, model: string, symptoms: string[]) => {
    setDiagnosisContext({ brand, model, symptoms });
    const res = await runGeminiDiagnosis(brand, model, symptoms);
    setDiagnosisResult(res);
    setShowDiagnosisModal(true);
  };

  // Package booking selection
  const handleSelectPackageForBooking = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    handlePublicNavigate('booking');
  };

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

  // Admin state modifiers with backend API sync
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

  // ==========================================
  // SECTION 1: LOGIN VIEW
  // ==========================================
  if (activeSection === 'login') {
    return <LoginView onLogin={handleLogin} />;
  }

  // ==========================================
  // SECTION 2: WE N SPEED WORKSHOP CMS (ADMIN)
  // ==========================================
  if (activeSection === 'admin' && currentUserRole === 'admin') {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col antialiased font-sans">
        <div className="flex flex-1 min-h-screen">
          <AdminSidebar
            currentTab={adminTab}
            onTabChange={handleAdminTabChange}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onLogout={handleLogout}
          />

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
              searchQuery={adminSearchQuery}
              onSearchChange={setAdminSearchQuery}
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

        {/* Admin Modals */}
        <GenerateReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

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

  // ==========================================
  // SECTION 3: GARAGE_OS RACER PORTAL
  // ==========================================
  if (activeSection === 'racer' && currentUserRole === 'racer') {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col antialiased font-sans">
        <div className="flex flex-1 min-h-screen">
          <RacerSidebar
            currentTab={racerTab}
            onTabChange={handleRacerTabChange}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onLogout={handleLogout}
          />

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

        {/* Racer Emergency Modal */}
        <EmergencySupportModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
        />
      </div>
    );
  }

  // ==========================================
  // SECTION 4: CLIENT-WEB (PUBLIC SPA)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col selection:bg-[#FFE01B] selection:text-black">
      
      {/* Top Header Navigation */}
      <HeaderNav
        currentView={publicView}
        onNavigate={handlePublicNavigate}
        onOpenBooking={() => handlePublicNavigate('booking')}
        onOpenDiagnosis={() => handlePublicNavigate('dashboard')}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenPortal={() => {
          if (currentUserRole === 'admin') {
            setActiveSection('admin');
            setAdminTab('overview');
            window.history.pushState(null, '', '/admin/overview');
          } else if (currentUserRole === 'racer') {
            setActiveSection('racer');
            setRacerTab('dashboard');
            window.history.pushState(null, '', '/racer/dashboard');
          } else {
            setActiveSection('login');
            window.history.pushState(null, '', '/login');
          }
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW 1: DASHBOARD / SERVICE SELECTION */}
        {publicView === 'dashboard' && (
          <div className="flex flex-col md:flex-row min-h-[calc(100vh-61px)]">
            
            {/* Left Sidebar */}
            <div className="hidden md:block">
              <Sidebar
                activeTab={sidebarTab}
                onSelectTab={(tab) => {
                  setSidebarTab(tab);
                  if (tab === 'performance') handlePublicNavigate('telemetry');
                  if (tab === 'garage') handlePublicNavigate('telemetry');
                  if (tab === 'diagnostics') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onUpgradePlan={() => handlePublicNavigate('membership')}
                onViewProfile={() => handlePublicNavigate('membership')}
              />
            </div>

            {/* Main Dashboard Canvas */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-10 overflow-y-auto max-w-7xl">
              <DigitalDiagnosisCard
                onAnalyze={(brand, model, symptoms) => handleRunDiagnosis(brand, model, symptoms)}
                onSelectServicePackage={(pkgId) => {
                  const pkg = SERVICE_PACKAGES.find((p) => p.id === pkgId) || SERVICE_PACKAGES[0];
                  handleSelectPackageForBooking(pkg);
                }}
              />

              <ServicePackages
                onSelectPackage={handleSelectPackageForBooking}
                selectedPackageId={selectedPackage?.id}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: LANDING PAGE */}
        {publicView === 'landing' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
            <LandingPage
              onBookNow={() => handlePublicNavigate('booking')}
              onSelectPackage={handleSelectPackageForBooking}
              onStartDiagnosis={() => handlePublicNavigate('dashboard')}
              onOpenArticleModal={(art) => setActiveArticle(art)}
            />
          </div>
        )}

        {/* VIEW 3: SCHEDULE YOUR LAB SESSION BOOKING FLOW */}
        {publicView === 'booking' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <BookingFlow
              initialPackage={selectedPackage}
              onBackToDashboard={() => handlePublicNavigate('dashboard')}
              onBookingSuccess={(bookingData) => {
                console.log('Lab Session Booked successfully:', bookingData);
              }}
            />
          </div>
        )}

        {/* VIEW 4: LIVE TELEMETRY & DIAGNOSTICS SCAN */}
        {publicView === 'telemetry' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <TelemetryView
              onBookTuneUp={() => {
                setSelectedPackage(SERVICE_PACKAGES[2]);
                handlePublicNavigate('booking');
              }}
            />
          </div>
        )}

        {/* VIEW 5: ELITE MEMBERSHIP & RACER PROFILE */}
        {publicView === 'membership' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <MembershipView
              onBookService={() => handlePublicNavigate('booking')}
            />
          </div>
        )}

      </main>

      {/* Global Brand Footer */}
      <Footer
        onNavigateToBooking={() => handlePublicNavigate('booking')}
        onNavigateToServices={() => handlePublicNavigate('dashboard')}
      />

      {/* Diagnosis Detail Modal */}
      {showDiagnosisModal && (
        <DiagnosisResultModal
          result={diagnosisResult}
          brand={diagnosisContext.brand}
          model={diagnosisContext.model}
          symptoms={diagnosisContext.symptoms}
          onClose={() => setShowDiagnosisModal(false)}
          onBookPackage={(pkg) => {
            setShowDiagnosisModal(false);
            handleSelectPackageForBooking(pkg);
          }}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          onNavigateToBooking={() => {
            setShowNotifications(false);
            handlePublicNavigate('booking');
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Article Detail Modal */}
      {activeArticle && (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}

    </div>
  );
}

export default App;
