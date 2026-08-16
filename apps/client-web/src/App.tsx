import React, { useState } from 'react';
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
import { ServicePackage, SERVICE_PACKAGES } from './data/workshopData';
import { runGeminiDiagnosis, DiagnosisResult } from './services/aiDiagnosis';

export function App() {
  // Navigation View State: 'dashboard' (Image 1) | 'landing' (Image 2) | 'booking' (Image 3) | 'telemetry' | 'membership'
  const [currentView, setCurrentView] = useState<'dashboard' | 'landing' | 'booking' | 'telemetry' | 'membership'>('dashboard');

  // Sidebar Sub-tab when inside dashboard
  const [sidebarTab, setSidebarTab] = useState<'diagnostics' | 'services' | 'performance' | 'garage' | 'support'>('services');

  // Selected Service Package for booking flow
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(SERVICE_PACKAGES[1]);

  // Diagnosis Modal State
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisContext, setDiagnosisContext] = useState<{ brand: string; model: string; symptoms: string[] }>({
    brand: 'YAMAHA',
    model: 'NMAX 155 Connected',
    symptoms: ['brebet', 'gredeg'],
  });
  const [showDiagnosisModal, setShowDiagnosisModal] = useState<boolean>(false);

  // Other Modals
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeArticle, setActiveArticle] = useState<any>(null);

  // Handle running diagnosis from either Dashboard or Landing Page
  const handleRunDiagnosis = async (brand: string, model: string, symptoms: string[]) => {
    setDiagnosisContext({ brand, model, symptoms });
    const res = await runGeminiDiagnosis(brand, model, symptoms);
    setDiagnosisResult(res);
    setShowDiagnosisModal(true);
  };

  // Handle selecting a package to book
  const handleSelectPackageForBooking = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation matching all views */}
      <HeaderNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => {
          setCurrentView('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDiagnosis={() => {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW 1: DASHBOARD / SERVICE SELECTION (Screenshot 1) */}
        {currentView === 'dashboard' && (
          <div className="flex flex-col md:flex-row min-h-[calc(100vh-61px)]">
            
            {/* Left Sidebar matching Screenshot 1 */}
            <div className="hidden md:block">
              <Sidebar
                activeTab={sidebarTab}
                onSelectTab={(tab) => {
                  setSidebarTab(tab);
                  if (tab === 'performance') setCurrentView('telemetry');
                  if (tab === 'garage') setCurrentView('telemetry');
                  if (tab === 'diagnostics') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onUpgradePlan={() => setCurrentView('membership')}
                onViewProfile={() => setCurrentView('membership')}
              />
            </div>

            {/* Main Dashboard Canvas (8 cols + 4 cols inside DigitalDiagnosisCard & Service Packages) */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-10 overflow-y-auto max-w-7xl">
              
              {/* Digital Diagnosis Console & Workshop Card */}
              <DigitalDiagnosisCard
                onAnalyze={(brand, model, symptoms) => handleRunDiagnosis(brand, model, symptoms)}
                onSelectServicePackage={(pkgId) => {
                  const pkg = SERVICE_PACKAGES.find((p) => p.id === pkgId) || SERVICE_PACKAGES[0];
                  handleSelectPackageForBooking(pkg);
                }}
              />

              {/* Paket Service Pilihan Grid matching Screenshot 1 */}
              <ServicePackages
                onSelectPackage={handleSelectPackageForBooking}
                selectedPackageId={selectedPackage?.id}
              />

            </div>

          </div>
        )}

        {/* VIEW 2: LANDING PAGE (Screenshot 2) */}
        {currentView === 'landing' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
            <LandingPage
              onBookNow={() => {
                setCurrentView('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectPackage={handleSelectPackageForBooking}
              onStartDiagnosis={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenArticleModal={(art) => setActiveArticle(art)}
            />
          </div>
        )}

        {/* VIEW 3: SCHEDULE YOUR LAB SESSION BOOKING FLOW (Screenshot 3) */}
        {currentView === 'booking' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <BookingFlow
              initialPackage={selectedPackage}
              onBackToDashboard={() => setCurrentView('dashboard')}
              onBookingSuccess={(bookingData) => {
                console.log('Lab Session Booked successfully:', bookingData);
              }}
            />
          </div>
        )}

        {/* VIEW 4: LIVE TELEMETRY & DIAGNOSTICS SCAN */}
        {currentView === 'telemetry' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <TelemetryView
              onBookTuneUp={() => {
                setSelectedPackage(SERVICE_PACKAGES[2]); // Full service
                setCurrentView('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* VIEW 5: ELITE MEMBERSHIP & RACER PROFILE */}
        {currentView === 'membership' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
            <MembershipView
              onBookService={() => {
                setCurrentView('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

      </main>

      {/* Global Brand Footer */}
      <Footer
        onNavigateToBooking={() => {
          setCurrentView('booking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToServices={() => {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
            setCurrentView('booking');
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
