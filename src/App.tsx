import React, { useState, useEffect } from 'react';
import { UserProfile, ScreenId, ForceWelfareOverview, UserRole } from './types.js';
import { api } from './api/client.js';
import { Header } from './components/common/Header.js';
import { ScreenNav } from './components/navigation/ScreenNav.js';
import { CommandOverviewScreen } from './components/screens/CommandOverviewScreen.js';
import { UnitIntelligenceScreen } from './components/screens/UnitIntelligenceScreen.js';
import { PersonnelViewScreen } from './components/screens/PersonnelViewScreen.js';
import { InterventionAssistantScreen } from './components/screens/InterventionAssistantScreen.js';
import { WhatIfSimulatorScreen } from './components/screens/WhatIfSimulatorScreen.js';
import { ModelMonitoringScreen } from './components/screens/ModelMonitoringScreen.js';
import { AuditPrivacyScreen } from './components/screens/AuditPrivacyScreen.js';
import { PersonnelDashboard } from './components/personnel/PersonnelDashboard.js';
import { DemoGuideModal } from './components/common/DemoGuideModal.js';
import { TacticalResetModal } from './components/common/TacticalResetModal.js';
import { WhoMethodologyModal } from './components/common/WhoMethodologyModal.js';
import { ExecutiveBriefModal } from './components/common/ExecutiveBriefModal.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { Sidebar } from './components/navigation/Sidebar.js';
import { Smartphone, Layers, UserCheck, Wind, BookOpen, FileText, Sparkles, X, ArrowLeft, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Landing Page vs Dashboard View State
  const [pageView, setPageView] = useState<'landing' | 'dashboard'>('landing');
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  // Modals inspired by Headspace (Tactical Reset) and WHO GDHM (Methodology & Executive Brief)
  const [isTacticalResetOpen, setIsTacticalResetOpen] = useState(false);
  const [isWhoMethodologyOpen, setIsWhoMethodologyOpen] = useState(false);
  const [isExecutiveBriefOpen, setIsExecutiveBriefOpen] = useState(false);
  const [overviewData, setOverviewData] = useState<ForceWelfareOverview | null>(null);

  // 7-Screen Dashboard Hierarchy State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('command_overview');
  const [viewMode, setViewMode] = useState<'intelligence_suite' | 'personnel_checkin'>('intelligence_suite');

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

  const handleSwitchUser = (userId: string) => {
    api.setUserId(userId);
    fetchSession();
    if (userId.startsWith('p-')) {
      setCurrentScreen('personnel_view');
      setViewMode('personnel_checkin');
    } else if (userId.startsWith('cmd-')) {
      setCurrentScreen('command_overview');
      setViewMode('intelligence_suite');
    } else if (userId.startsWith('wo-')) {
      setCurrentScreen('intervention_assistant');
      setViewMode('intelligence_suite');
    }
  };

  const handleEnterDashboard = (role?: UserRole, userId?: string) => {
    if (userId) {
      api.setUserId(userId);
      fetchSession();
    }
    if (role === 'personnel') {
      setViewMode('personnel_checkin');
    } else if (role === 'welfare_officer') {
      setViewMode('intelligence_suite');
      setCurrentScreen('intervention_assistant');
    } else if (role === 'command_viewer') {
      setViewMode('intelligence_suite');
      setCurrentScreen('command_overview');
    }
    setWelcomeBanner('Welcome to your personalized workspace! You can switch roles or return to the Overview & Workflow Guide at any time.');
    setPageView('dashboard');
  };

  const handleSignOut = () => {
    // Reset session and return to peaceful landing page
    api.setUserId('p-014');
    fetchSession();
    setPageView('landing');
    setWelcomeBanner(null);
  };

  const handleResetDemo = async () => {
    if (confirm('Reset all demo fixtures and cases to initial baseline?')) {
      try {
        await api.resetSystem();
        fetchSession();
        setCurrentScreen('command_overview');
        alert('All test fixtures reset to baseline.');
      } catch (err: any) {
        alert(err.message || 'Reset failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-700 text-sm">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-bold text-base text-slate-900">SAHARA AI Welfare Intelligence</span>
        <span className="text-xs text-slate-500 mt-1">Initializing WHO-standard telemetry &amp; TreeSHAP engines...</span>
      </div>
    );
  }

  // If in Landing Page mode, render the calm, interactive professional landing page
  if (pageView === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={handleEnterDashboard}
        onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
      />
    );
  }

  const renderActiveScreen = () => {
    if (viewMode === 'personnel_checkin' && currentUser) {
      return <PersonnelDashboard user={currentUser} onRefreshUser={fetchSession} />;
    }

    switch (currentScreen) {
      case 'command_overview':
        return (
          <CommandOverviewScreen
            onNavigateScreen={setCurrentScreen}
            onOpenMethodology={() => setIsWhoMethodologyOpen(true)}
            onOpenExecBrief={() => setIsExecutiveBriefOpen(true)}
            onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          />
        );
      case 'unit_intelligence':
        return <UnitIntelligenceScreen onNavigateScreen={setCurrentScreen} />;
      case 'personnel_view':
        return (
          <PersonnelViewScreen
            onNavigateScreen={setCurrentScreen}
            selectedPersonnelId="p-014"
            onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          />
        );
      case 'intervention_assistant':
        return <InterventionAssistantScreen onNavigateScreen={setCurrentScreen} />;
      case 'what_if_simulator':
        return <WhatIfSimulatorScreen onNavigateScreen={setCurrentScreen} initialPersonnelId="p-014" />;
      case 'model_monitoring':
        return <ModelMonitoringScreen onNavigateScreen={setCurrentScreen} />;
      case 'audit_privacy':
        return <AuditPrivacyScreen onNavigateScreen={setCurrentScreen} />;
      default:
        return <CommandOverviewScreen onNavigateScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans antialiased">
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
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onJumpToRole={handleSwitchUser}
      />

      {/* Top Level Layout: Switchable Left Sidebar + Main App Viewport */}
      <div className="min-h-screen bg-[#FAF8F5] flex flex-row antialiased text-slate-900 selection:bg-orange-500 selection:text-white">
        {/* Switchable Left Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onSelectScreen={(screen) => {
            setCurrentScreen(screen);
            setViewMode('intelligence_suite');
          }}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onSignOut={handleSignOut}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          criticalAlertsCount={overviewData?.criticalTrendAlerts || 17}
          openCasesCount={2}
          onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
          onOpenWhoMethodology={() => setIsWhoMethodologyOpen(true)}
          onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
          onOpenLandingPage={() => setPageView('landing')}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          {/* Top Application Header */}
          <Header
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            onResetDemo={handleResetDemo}
            isMobileSimulated={isMobileSimulated}
            onToggleMobileSim={() => setIsMobileSimulated(!isMobileSimulated)}
            onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
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
            <div className="bg-emerald-900 text-emerald-100 px-4 sm:px-6 lg:px-8 py-2.5 border-b border-emerald-800 text-xs flex items-center justify-between shadow-xs">
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    <strong>Active Workspace:</strong> {currentUser?.name} ({currentUser?.rank} &bull; {currentUser?.role}) &bull; Switch screens easily via the left sidebar or click <strong>Sign Out</strong> in the corner anytime.
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setPageView('landing')}
                    className="text-[11px] underline text-emerald-200 hover:text-white cursor-pointer"
                  >
                    Back to Guide
                  </button>
                  <button
                    onClick={() => setWelcomeBanner(null)}
                    className="w-5 h-5 rounded-full hover:bg-emerald-800 flex items-center justify-center text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lightweight Subheader Breadcrumb Strip */}
          <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 sm:px-6 lg:px-8 py-2 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-2">
              {isSidebarCollapsed && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="mr-1 p-1 rounded-md bg-slate-800 text-orange-400 hover:bg-slate-700 cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sidebar</span>
                </button>
              )}
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Current View:</span>
              <span className="font-semibold text-white">
                {viewMode === 'personnel_checkin'
                  ? 'Service Member Daily Health & Fatigue Check-In'
                  : currentScreen === 'command_overview'
                  ? 'Screen 01: Force Welfare & Readiness Pulse'
                  : currentScreen === 'unit_intelligence'
                  ? 'Screen 02: Unit Heatmap & Cohort Disaggregation'
                  : currentScreen === 'personnel_view'
                  ? 'Screen 03: Personnel Deep-Dive & TreeSHAP Attribution'
                  : currentScreen === 'intervention_assistant'
                  ? 'Screen 04: Clinical Care Protocols & Triage'
                  : currentScreen === 'what_if_simulator'
                  ? 'Screen 05: Recovery Sandbox & Duty Simulation'
                  : currentScreen === 'model_monitoring'
                  ? 'Screen 06: Model Trust & Drift Telemetry'
                  : 'Screen 07: Privacy Enclave & Audit Logs'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WHO GDHM Aligned</span>
              </span>
              <span>&bull;</span>
              <span className="text-slate-400">Section 14 Medical Privilege Active</span>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {isMobileSimulated ? (
              /* Mobile PWA Shell Mockup */
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-xs text-slate-500 mb-3 flex items-center space-x-1.5 font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-slate-700" />
                  <span>Tactical Handheld Viewport (375px PWA Spec)</span>
                </div>
                <div className="w-[390px] max-w-full bg-[#FAF8F5] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden min-h-[660px] flex flex-col">
                  {/* Phone Speaker Notch */}
                  <div className="bg-slate-900 h-6 flex items-center justify-center">
                    <div className="w-16 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Scrollable Mobile App Body */}
                  <div className="flex-1 p-3.5 overflow-y-auto max-h-[720px] bg-[#FAF8F5]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, x: viewMode === 'personnel_checkin' ? 18 : -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: viewMode === 'personnel_checkin' ? -18 : 18 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {renderActiveScreen()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Home Indicator */}
                  <div className="bg-slate-900 h-4 flex items-center justify-center">
                    <div className="w-24 h-1 bg-slate-700 rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${viewMode}-${currentScreen}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                    filter: 'blur(1px)'
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)'
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    filter: 'blur(1px)'
                  }}
                  transition={{
                    duration: 0.24,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="w-full"
                >
                  {renderActiveScreen()}
                </motion.div>
              </AnimatePresence>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-stone-200/80 py-4 px-6 text-center text-xs text-slate-500">
            <p>
              SAHARA AI Welfare Intelligence System &bull; Armed Forces Health &amp; Welfare Directorate &bull; Compliant with Section 14 Privacy Directives &bull; WHO Global Digital Health Reporting Standard
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
