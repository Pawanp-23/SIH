import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, ForceWelfareOverview } from './types.js';
import { api } from './api/client.js';
import { Header } from './components/common/Header.js';
import { Sidebar, RolePortalId } from './components/navigation/Sidebar.js';
import { PersonnelDashboard } from './components/personnel/PersonnelDashboard.js';
import { WelfareOfficerPortal } from './components/welfare/WelfareOfficerPortal.js';
import { CommanderPortal } from './components/command/CommanderPortal.js';
import { AdminMlPortal } from './components/admin/AdminMlPortal.js';
import { TacticalResetModal } from './components/common/TacticalResetModal.js';
import { WhoMethodologyModal } from './components/common/WhoMethodologyModal.js';
import { ExecutiveBriefModal } from './components/common/ExecutiveBriefModal.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { LoginPortal } from './components/auth/LoginPortal.js';
import { Sparkles, X, PanelLeftOpen, ShieldCheck, Lock } from 'lucide-react';

export const getAllowedPortals = (role?: UserRole): RolePortalId[] => {
  switch (role) {
    case 'personnel':
      return ['personnel'];
    case 'welfare_officer':
      return ['personnel', 'welfare'];
    case 'command_viewer':
      return ['personnel', 'welfare', 'commander'];
    case 'admin':
    case 'demo_operator':
      return ['personnel', 'welfare', 'commander', 'admin'];
    default:
      return ['personnel'];
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Authentication & Page View State ('login' is default as requested)
  const [pageView, setPageView] = useState<'login' | 'landing' | 'dashboard'>('login');
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  // Modals
  const [isTacticalResetOpen, setIsTacticalResetOpen] = useState(false);
  const [isWhoMethodologyOpen, setIsWhoMethodologyOpen] = useState(false);
  const [isExecutiveBriefOpen, setIsExecutiveBriefOpen] = useState(false);
  const [overviewData, setOverviewData] = useState<ForceWelfareOverview | null>(null);

  // 4 Role-Based Experiences Portals State
  const [activePortal, setActivePortal] = useState<RolePortalId>('personnel');
  const [activeSubTab, setActiveSubTab] = useState<string>('checkin');

  const fetchSession = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setCurrentUser(res.user);
      }
      const ovRes = await api.getForceOverview();
      if (ovRes.success) {
        setOverviewData(ovRes.overview);
      }
    } catch (err) {
      console.error('Failed to get session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleLoginSuccess = async (role: UserRole, userId: string) => {
    api.setUserId(userId);
    try {
      const res = await api.getMe();
      if (res.success) {
        setCurrentUser(res.user);
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
    }

    // Direct user to their highest authorized echelon view
    if (role === 'personnel') {
      setActivePortal('personnel');
      setActiveSubTab('checkin');
      setWelcomeBanner('Authenticated as Service Member (Level 1). Access restricted to personal records and self check-in.');
    } else if (role === 'welfare_officer') {
      setActivePortal('welfare');
      setActiveSubTab('risk_overview');
      setWelcomeBanner('Authenticated as Medical Welfare Officer (Level 2). Access authorized for 2 portals: Medical Welfare & Personal Check-In.');
    } else if (role === 'command_viewer') {
      setActivePortal('commander');
      setActiveSubTab('unit_readiness');
      setWelcomeBanner('Authenticated as Commanding Officer (Level 3). Access authorized for 3 portals: Command Readiness, Welfare Triage, & Personal.');
    } else {
      setActivePortal('admin');
      setActiveSubTab('model_monitoring');
      setWelcomeBanner('Authenticated as Systems Administrator (Level 4). Full governance access across all 4 portals.');
    }
    setPageView('dashboard');
  };

  const handleEnterDashboard = (role?: UserRole, userId?: string) => {
    if (userId && role) {
      handleLoginSuccess(role, userId);
    } else {
      setPageView('login');
    }
  };

  const handleSignOut = () => {
    api.setUserId('p-014');
    fetchSession();
    setPageView('login');
    setWelcomeBanner(null);
  };

  const handleSwitchUser = (userId: string) => {
    api.setUserId(userId);
    fetchSession();
  };

  const handleSelectPortal = (portal: RolePortalId) => {
    const allowed = getAllowedPortals(currentUser?.role);
    if (!allowed.includes(portal)) {
      alert(`Access Restricted: Your active clearance level (${currentUser?.role}) does not authorize access to ${portal}.`);
      return;
    }
    setActivePortal(portal);
    if (portal === 'personnel') {
      setActiveSubTab('checkin');
    } else if (portal === 'welfare') {
      setActiveSubTab('risk_overview');
    } else if (portal === 'commander') {
      setActiveSubTab('unit_readiness');
    } else if (portal === 'admin') {
      setActiveSubTab('model_monitoring');
    }
  };

  const handleSelectSubTab = (portal: RolePortalId, subTab: string) => {
    const allowed = getAllowedPortals(currentUser?.role);
    if (!allowed.includes(portal)) return;
    setActivePortal(portal);
    setActiveSubTab(subTab);
  };

  const handleResetDemo = async () => {
    if (confirm('Reset all demo fixtures and cases to initial baseline?')) {
      try {
        await api.resetSystem();
        fetchSession();
        alert('All test fixtures reset to baseline.');
      } catch (err: any) {
        alert(err.message || 'Reset failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e9e4d8] flex flex-col items-center justify-center text-[#1E1E1E] text-sm">
        <div className="w-10 h-10 border-3 border-[#1d9f76] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-bold text-base text-[#1E1E1E] font-serif">SAHARA Healthcare Information System</span>
        <span className="text-xs text-[#5E5A52] mt-1">Verifying cryptographic credentials and clearance tiers...</span>
      </div>
    );
  }

  // If in Login mode, show the 4 Echelon Authentication Portal
  if (pageView === 'login') {
    return (
      <LoginPortal
        onLoginSuccess={handleLoginSuccess}
        onOpenSystemOverview={() => setPageView('landing')}
      />
    );
  }

  // If in System Overview mode, render the system documentation overview
  if (pageView === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={handleEnterDashboard}
        onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
        onOpenLogin={() => setPageView('login')}
      />
    );
  }

  // Check if current user is permitted to view the active portal
  const isPortalPermitted = getAllowedPortals(currentUser?.role).includes(activePortal);

  // Render the requested role-based experience
  const renderActivePortal = () => {
    if (!isPortalPermitted) {
      return (
        <div className="bg-[#F4EFE4] border border-rose-300 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#1E1E1E]">Clearance Level Insufficient</h2>
          <p className="text-xs text-[#5E5A52] leading-relaxed">
            Your active login ({currentUser?.rank} {currentUser?.name}, {currentUser?.role}) is not authorized to access this portal.
          </p>
          <button
            onClick={() => setActivePortal('personnel')}
            className="px-4 py-2 rounded-xl bg-[#1d9f76] text-white text-xs font-bold hover:bg-[#0f7058] cursor-pointer"
          >
            Return to Authorized Portal
          </button>
        </div>
      );
    }
    switch (activePortal) {
      case 'personnel':
        return (
          <PersonnelDashboard
            user={currentUser!}
            onRefreshUser={fetchSession}
            initialSubTab={activeSubTab as any}
          />
        );
      case 'welfare':
        return (
          <WelfareOfficerPortal
            initialSubTab={activeSubTab as any}
            onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          />
        );
      case 'commander':
        return (
          <CommanderPortal
            initialSubTab={activeSubTab as any}
            onOpenExecBrief={() => setIsExecutiveBriefOpen(true)}
            onOpenMethodology={() => setIsWhoMethodologyOpen(true)}
            onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          />
        );
      case 'admin':
        return <AdminMlPortal initialSubTab={activeSubTab as any} />;
      default:
        return <PersonnelDashboard user={currentUser!} onRefreshUser={fetchSession} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#e9e4d8] text-[#1E1E1E] flex flex-col font-sans antialiased selection:bg-[#1d9f76] selection:text-white">
      {/* Modals */}
      <TacticalResetModal
        isOpen={isTacticalResetOpen}
        onClose={() => setIsTacticalResetOpen(false)}
      />
      <WhoMethodologyModal
        isOpen={isWhoMethodologyOpen}
        onClose={() => setIsWhoMethodologyOpen(false)}
      />
      <ExecutiveBriefModal
        isOpen={isExecutiveBriefOpen}
        onClose={() => setIsExecutiveBriefOpen(false)}
        overview={overviewData}
      />

      {/* Top Level Layout: Switchable Left Sidebar + Main App Viewport */}
      <div className="min-h-screen bg-[#e9e4d8] flex flex-row antialiased text-[#1E1E1E]">
        {/* Switchable Left Sidebar with corner Sign Out */}
        <Sidebar
          activePortal={activePortal}
          onSelectPortal={handleSelectPortal}
          activeSubTab={activeSubTab}
          onSelectSubTab={handleSelectSubTab}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onSignOut={handleSignOut}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          criticalAlertsCount={overviewData?.criticalTrendAlerts || 3}
          openCasesCount={14}
          onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          onOpenWhoMethodology={() => setIsWhoMethodologyOpen(true)}
          onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
          onOpenLandingPage={() => setPageView('landing')}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden bg-[#e9e4d8]">
          {/* Top Application Header */}
          <Header
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            onResetDemo={handleResetDemo}
            isMobileSimulated={isMobileSimulated}
            onToggleMobileSim={() => setIsMobileSimulated(!isMobileSimulated)}
            onOpenDemoGuide={() => {}}
            onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
            onOpenWhoMethodology={() => setIsWhoMethodologyOpen(true)}
            onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
            onOpenLandingPage={() => setPageView('landing')}
            onSignOut={handleSignOut}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Welcoming Onboarding Banner (Dismissible) */}
          {welcomeBanner && (
            <div className="bg-[#F4EFE4] text-[#1E1E1E] px-4 sm:px-6 lg:px-8 py-2.5 border-b border-[#D2CBBB] text-xs flex items-center justify-between shadow-2xs">
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#1d9f76] shrink-0" />
                  <span>
                    <strong>Active Role Portal:</strong> {activePortal === 'personnel' ? '01 Personnel Portal' : activePortal === 'welfare' ? '02 Welfare Officer' : activePortal === 'commander' ? '03 Commander' : '04 Admin / ML'} &bull; User: {currentUser?.name} ({currentUser?.rank}) &bull; Switch anytime from the left sidebar or use <strong>Log Out</strong> in the corner.
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setPageView('landing')}
                    className="text-[11px] underline text-[#0f7058] hover:text-[#1d9f76] cursor-pointer font-medium"
                  >
                    Back to Landing
                  </button>
                  <button
                    onClick={() => setWelcomeBanner(null)}
                    className="w-5 h-5 rounded-full hover:bg-[#E3DDCF] flex items-center justify-center text-[#5E5A52] hover:text-[#1E1E1E] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lightweight Subheader Breadcrumb Strip */}
          <div className="bg-[#E3DDCF] border-b border-[#D2CBBB] text-[#5E5A52] px-4 sm:px-6 lg:px-8 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="mr-1 p-1 rounded-md bg-[#F4EFE4] text-[#1d9f76] hover:bg-[#D2CBBB] cursor-pointer flex items-center gap-1 text-[11px] font-medium border border-[#D2CBBB]"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Expand Sidebar</span>
                </button>
              )}
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E5A52]">Portal:</span>
              <span className="font-bold text-[#1E1E1E]">
                {activePortal === 'personnel'
                  ? '01 PERSONNEL PORTAL'
                  : activePortal === 'welfare'
                  ? '02 WELFARE OFFICER'
                  : activePortal === 'commander'
                  ? '03 COMMANDER'
                  : '04 ADMIN / ML'}
              </span>
              <span className="text-[#D2CBBB]">&bull;</span>
              <span className="text-xs font-medium text-[#0f7058] capitalize">
                {activeSubTab.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="hidden sm:flex items-center text-[#0f7058] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#1d9f76]" />
                Section 14 Medical Secrecy Certified
              </span>
            </div>
          </div>

          {/* Main Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#e9e4d8]">
            <div className={`${isMobileSimulated ? 'max-w-md mx-auto bg-[#F4EFE4] rounded-3xl p-4 shadow-xl border-4 border-[#D2CBBB]' : 'max-w-7xl mx-auto'}`}>
              {renderActivePortal()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
