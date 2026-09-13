import React from 'react';
import { UserProfile } from '../../types.js';
import {
  Shield,
  RotateCcw,
  Smartphone,
  Monitor,
  Compass,
  Wind,
  BookOpen,
  FileText,
  UserCheck,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  onSwitchUser: (userId: string) => void;
  onResetDemo: () => void;
  isMobileSimulated: boolean;
  onToggleMobileSim: () => void;
  onOpenDemoGuide: () => void;
  onOpenTacticalReset?: () => void;
  onOpenWhoMethodology?: () => void;
  onOpenExecutiveBrief?: () => void;
  onOpenLandingPage?: () => void;
  onSignOut?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onResetDemo,
  isMobileSimulated,
  onToggleMobileSim,
  onOpenDemoGuide,
  onOpenTacticalReset,
  onOpenWhoMethodology,
  onOpenExecutiveBrief,
  onOpenLandingPage,
  onSignOut,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'personnel':
        return { tag: 'Service Member', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'welfare_officer':
        return { tag: 'Welfare Officer', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'command_viewer':
        return { tag: 'Command Staff', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      default:
        return { tag: 'Standard Access', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const roleMeta = getRoleBadge(currentUser?.role);

  return (
    <header id="sahara-header" className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Sidebar Toggle + Logo & Platform Context */}
          <div className="flex items-center space-x-3 shrink-0">
            {onToggleSidebar && (
              <button
                id="btn-header-sidebar-toggle"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer mr-1"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-orange-400" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-slate-300" />
                )}
              </button>
            )}

            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-xs">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-[16px] tracking-tight text-white font-serif">SAHARA</span>
                <span className="h-3 w-px bg-slate-700 hidden sm:inline-block" />
                <span className="text-[11px] text-slate-300 hidden sm:inline-block font-medium">
                  Health &amp; Welfare Intelligence
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-orange-300 font-medium">
                  {currentUser?.unit || '102nd Mountain Battalion'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">&bull; Section 14 Enclave</span>
              </div>
            </div>
          </div>

          {/* Center / Action Pills: Headspace & WHO Highlights */}
          <div className="hidden lg:flex items-center gap-2">
            {/* 1-Min Tactical Reset (Headspace inspiration) */}
            {onOpenTacticalReset && (
              <button
                id="btn-open-tactical-reset"
                onClick={onOpenTacticalReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 transition-all cursor-pointer shadow-xs"
                title="Open 60-second guided box breathing decompression"
              >
                <Wind className="w-3.5 h-3.5 text-orange-400" />
                <span>1-Min Reset</span>
              </button>
            )}

            {/* WHO Indicator Methodology */}
            {onOpenWhoMethodology && (
              <button
                id="btn-open-who-methodology"
                onClick={onOpenWhoMethodology}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="WHO Global Health Data indicator definitions & formulations"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Indicator Guide</span>
              </button>
            )}

            {/* Executive Intelligence Brief */}
            {onOpenExecutiveBrief && (
              <button
                id="btn-open-exec-brief"
                onClick={onOpenExecutiveBrief}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="View and print WHO-standard Sector Executive Brief"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Executive Brief</span>
              </button>
            )}

            {/* Return to Landing Page / Workflow Guide */}
            {onOpenLandingPage && (
              <button
                id="btn-open-landing-overview"
                onClick={onOpenLandingPage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer"
                title="Explore interactive landing page and system workflow"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Overview &amp; Workflow</span>
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Walkthrough Guide */}
            <button
              id="btn-demo-guide"
              onClick={onOpenDemoGuide}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="View verification protocols"
            >
              <Compass className="w-3.5 h-3.5 mr-1 text-teal-400" />
              <span className="hidden md:inline">Protocol Guide</span>
            </button>

            {/* Mobile Viewport Toggle */}
            <button
              id="btn-toggle-pwa-view"
              onClick={onToggleMobileSim}
              className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                isMobileSimulated
                  ? 'bg-orange-500 text-white border-orange-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle mobile device preview"
            >
              {isMobileSimulated ? (
                <>
                  <Monitor className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden sm:inline">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span className="hidden sm:inline">Mobile PWA</span>
                </>
              )}
            </button>

            {/* Reset State */}
            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
              title="Reset data to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Role & Personnel Switcher */}
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 shadow-inner">
              <UserCheck className="w-3.5 h-3.5 text-orange-400 mr-2 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Clearance</span>
                <select
                  id="role-select"
                  value={currentUser?.id || 'p-014'}
                  onChange={(e) => onSwitchUser(e.target.value)}
                  className="bg-transparent text-xs font-medium text-slate-100 border-none p-0 focus:ring-0 focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <optgroup label="Service Personnel (Individual View)">
                    <option value="p-014" className="bg-slate-900 text-slate-100">
                      Const. Rajesh Verma (102nd Bn)
                    </option>
                    <option value="p-008" className="bg-slate-900 text-slate-100">
                      L/Nk Amit Sharma (102nd Bn)
                    </option>
                    <option value="p-022" className="bg-slate-900 text-slate-100">
                      Hav. Manoj Rao (102nd Bn)
                    </option>
                  </optgroup>
                  <optgroup label="Welfare Officer (Assigned Triage)">
                    <option value="wo-kumar" className="bg-slate-900 text-slate-100">
                      Subedar Arjun Kumar (Welfare Officer)
                    </option>
                  </optgroup>
                  <optgroup label="Sector Command (Aggregates Only)">
                    <option value="cmd-singh" className="bg-slate-900 text-slate-100">
                      Col. Harpreet Singh (Sector Commander)
                    </option>
                  </optgroup>
                </select>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1.5 pointer-events-none" />
            </div>

            {/* Corner Sign Out / Log Out Button */}
            {onSignOut && (
              <button
                id="btn-header-signout"
                onClick={onSignOut}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer shadow-xs ml-1"
                title="Sign out of current clearance and return to welcome portal"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
