import React, { useState } from 'react';
import { ScreenId, UserProfile, UserRole } from '../../types.js';
import {
  Shield,
  ShieldAlert,
  Activity,
  UserCheck,
  Stethoscope,
  Sliders,
  Cpu,
  Lock,
  Heart,
  Layers,
  Wind,
  BookOpen,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkles,
  Compass,
  RotateCcw,
  Smartphone,
  Monitor,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  viewMode: 'intelligence_suite' | 'personnel_checkin';
  onSelectViewMode: (mode: 'intelligence_suite' | 'personnel_checkin') => void;
  currentUser: UserProfile | null;
  onSwitchUser: (userId: string) => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  criticalAlertsCount?: number;
  openCasesCount?: number;
  onOpenTacticalReset: () => void;
  onOpenWhoMethodology: () => void;
  onOpenExecutiveBrief: () => void;
  onOpenLandingPage: () => void;
  onOpenDemoGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  viewMode,
  onSelectViewMode,
  currentUser,
  onSwitchUser,
  onSignOut,
  isCollapsed,
  onToggleCollapse,
  criticalAlertsCount = 17,
  openCasesCount = 2,
  onOpenTacticalReset,
  onOpenWhoMethodology,
  onOpenExecutiveBrief,
  onOpenLandingPage,
  onOpenDemoGuide
}) => {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const suiteScreens: Array<{
    id: ScreenId;
    label: string;
    sublabel: string;
    stepNumber: string;
    badge?: string | number;
    badgeColor?: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'command_overview',
      label: 'Force Welfare Pulse',
      sublabel: 'WHO Executive Telemetry',
      stepNumber: '01',
      badge: `${criticalAlertsCount} Alerts`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShieldAlert
    },
    {
      id: 'unit_intelligence',
      label: 'Unit Heatmap',
      sublabel: 'Cohort Disaggregation',
      stepNumber: '02',
      icon: Activity
    },
    {
      id: 'personnel_view',
      label: 'Personnel & SHAP',
      sublabel: 'Plain-English Attribution',
      stepNumber: '03',
      badge: 'Score 78',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: UserCheck
    },
    {
      id: 'intervention_assistant',
      label: 'Care Protocols',
      sublabel: 'Evidence-Grounded RAG',
      stepNumber: '04',
      badge: `${openCasesCount} Active`,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      icon: Stethoscope
    },
    {
      id: 'what_if_simulator',
      label: 'Recovery Sandbox',
      sublabel: 'What-If Duty Simulation',
      stepNumber: '05',
      badge: 'Sim',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: Sliders
    },
    {
      id: 'model_monitoring',
      label: 'Model Trust & Drift',
      sublabel: 'Observability & Metrics',
      stepNumber: '06',
      badge: 'v1.2 OK',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Cpu
    },
    {
      id: 'audit_privacy',
      label: 'Privacy Enclave',
      sublabel: 'k ≥ 10 Anonymity Enforced',
      stepNumber: '07',
      badge: 'Protected',
      badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/30',
      icon: Lock
    }
  ];

  return (
    <aside
      id="dashboard-sidebar"
      className={`bg-slate-950 text-slate-200 border-r border-slate-800/90 flex flex-col justify-between shrink-0 transition-all duration-300 relative select-none z-30 h-screen sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Header & Branding */}
      <div className="flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={onOpenLandingPage}
            className={`flex items-center space-x-3 cursor-pointer group ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="Return to SAHARA Overview"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:border-orange-400 transition-all shadow-md shadow-orange-950/40 shrink-0">
              <Shield className="w-5 h-5 text-orange-400 group-hover:scale-105 transition-transform" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base tracking-tight text-white font-serif">SAHARA</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">Welfare &amp; Readiness</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              id="btn-collapse-sidebar"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {isCollapsed && (
          <div className="p-2 border-b border-slate-800/80 flex justify-center">
            <button
              id="btn-expand-sidebar"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mode Switcher: Command & Care vs Service Member */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
          {!isCollapsed ? (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 mb-1 font-semibold">
                Operating Workspace
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800/90 shadow-inner">
                <button
                  id="btn-sidebar-mode-suite"
                  onClick={() => onSelectViewMode('intelligence_suite')}
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none ${
                    viewMode === 'intelligence_suite'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 mb-0.5" />
                  <span className="text-[11px] leading-tight">Command Suite</span>
                </button>
                <button
                  id="btn-sidebar-mode-checkin"
                  onClick={() => onSelectViewMode('personnel_checkin')}
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none ${
                    viewMode === 'personnel_checkin'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 mb-0.5" />
                  <span className="text-[11px] leading-tight">Daily Check-In</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => onSelectViewMode('intelligence_suite')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === 'intelligence_suite'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
                title="Command & Care Suite"
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSelectViewMode('personnel_checkin')}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === 'personnel_checkin'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
                title="Service Member Daily Check-In"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Command & Care Suite Screens */}
        {viewMode === 'intelligence_suite' ? (
          <div>
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-2 font-semibold flex items-center justify-between">
                <span>Intelligence Screens (7)</span>
                <span className="text-[9px] text-orange-400">Tactical</span>
              </div>
            )}
            <div className="space-y-1">
              {suiteScreens.map((screen) => {
                const Icon = screen.icon;
                const isActive = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    id={`sidebar-screen-${screen.id}`}
                    onClick={() => onSelectScreen(screen.id)}
                    className={`w-full text-left rounded-2xl transition-all cursor-pointer flex items-center ${
                      isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
                    } ${
                      isActive
                        ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-xs'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                    }`}
                    title={isCollapsed ? `${screen.label} (${screen.stepNumber})` : undefined}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono text-slate-400">{screen.stepNumber}</span>
                            <span className="text-xs font-bold truncate text-slate-100">{screen.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{screen.sublabel}</div>
                        </div>
                        {screen.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ml-1.5 ${
                              screen.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {screen.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Service Member Navigation */
          <div>
            {!isCollapsed && (
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-2 font-semibold">
                Member Wellness Portal
              </div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => onSelectViewMode('personnel_checkin')}
                className={`w-full text-left rounded-2xl p-3 flex items-center ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } bg-slate-800/90 text-white border border-slate-700/80 shadow-xs`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-100">Daily Health Reflection</div>
                    <div className="text-[10px] text-slate-400">Sleep, fatigue &amp; stress log</div>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick Supportive Clinical Tools */}
        <div>
          {!isCollapsed && (
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-2 font-semibold">
              Supportive Protocols
            </div>
          )}
          <div className="space-y-1">
            {/* Tactical Reset Breathing */}
            <button
              id="sidebar-btn-breathing"
              onClick={onOpenTacticalReset}
              className={`w-full text-left rounded-2xl transition-all cursor-pointer flex items-center ${
                isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
              } text-slate-400 hover:bg-slate-900/80 hover:text-orange-300`}
              title="1-Min Guided Breathing Reset"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 border border-slate-800 flex items-center justify-center shrink-0">
                <Wind className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">1-Min Tactical Reset</div>
                  <div className="text-[10px] text-slate-400">Guided box breathing ritual</div>
                </div>
              )}
            </button>

            {/* WHO Methodology */}
            <button
              id="sidebar-btn-methodology"
              onClick={onOpenWhoMethodology}
              className={`w-full text-left rounded-2xl transition-all cursor-pointer flex items-center ${
                isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
              } text-slate-400 hover:bg-slate-900/80 hover:text-slate-200`}
              title="WHO GDHM Health Standards"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">WHO Methodology</div>
                  <div className="text-[10px] text-slate-400">GDHM 4-Pillar framework</div>
                </div>
              )}
            </button>

            {/* Executive Intelligence Brief */}
            <button
              id="sidebar-btn-exec-brief"
              onClick={onOpenExecutiveBrief}
              className={`w-full text-left rounded-2xl transition-all cursor-pointer flex items-center ${
                isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
              } text-slate-400 hover:bg-slate-900/80 hover:text-slate-200`}
              title="Export Executive Brief"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 border border-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">Executive Brief</div>
                  <div className="text-[10px] text-slate-400">Sector printout &amp; summary</div>
                </div>
              )}
            </button>

            {/* Overview & Workflow Guide */}
            <button
              id="sidebar-btn-landing"
              onClick={onOpenLandingPage}
              className={`w-full text-left rounded-2xl transition-all cursor-pointer flex items-center ${
                isCollapsed ? 'justify-center p-3' : 'p-2.5 space-x-3'
              } text-slate-400 hover:bg-slate-900/80 hover:text-emerald-300`}
              title="Return to Interactive Workflow Guide"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">Workflow Guide</div>
                  <div className="text-[10px] text-slate-400">Interactive 4-step explainer</div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Corner: User Clearance & Dedicated Sign Out / Log Out */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-900/60 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            {/* User Details Card */}
            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/90 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.name || 'Authorized Member'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser?.rank || 'Personnel'} &bull; {currentUser?.role || 'Active'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Switch Clearance Select */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
              <span className="text-[9px] uppercase font-mono text-slate-400 mr-2 shrink-0">Role:</span>
              <select
                id="sidebar-role-select"
                value={currentUser?.id || 'p-014'}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="bg-transparent text-[11px] font-medium text-slate-200 border-none p-0 focus:ring-0 focus:outline-none cursor-pointer w-full"
              >
                <optgroup label="Service Personnel">
                  <option value="p-014" className="bg-slate-900 text-slate-100">
                    Const. Rajesh Verma (102nd)
                  </option>
                  <option value="p-008" className="bg-slate-900 text-slate-100">
                    L/Nk Amit Sharma (102nd)
                  </option>
                  <option value="p-022" className="bg-slate-900 text-slate-100">
                    Hav. Manoj Rao (102nd)
                  </option>
                </optgroup>
                <optgroup label="Welfare Officers">
                  <option value="wo-kumar" className="bg-slate-900 text-slate-100">
                    Sub. Arjun Kumar (Welfare)
                  </option>
                </optgroup>
                <optgroup label="Commanders">
                  <option value="cmd-singh" className="bg-slate-900 text-slate-100">
                    Col. Harpreet Singh (Cmd)
                  </option>
                </optgroup>
              </select>
            </div>

            {/* Explicit Sign Out / Log Out Button in Corner */}
            <button
              id="btn-sidebar-signout"
              onClick={onSignOut}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out / Log Out</span>
            </button>
          </div>
        ) : (
          /* Collapsed User & Logout Icon */
          <div className="flex flex-col items-center space-y-2">
            <div
              className="w-9 h-9 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs"
              title={`${currentUser?.name} (${currentUser?.rank})`}
            >
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <button
              id="btn-sidebar-signout-collapsed"
              onClick={onSignOut}
              className="w-9 h-9 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 flex items-center justify-center transition-all cursor-pointer"
              title="Sign Out / Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
