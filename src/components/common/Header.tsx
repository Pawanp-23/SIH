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
        return { tag: '01 Service Member', color: 'bg-[#1d9f76]/20 text-[#0f7058] border-[#1d9f76]/30' };
      case 'welfare_officer':
        return { tag: '02 Welfare Officer', color: 'bg-[#efa02a]/20 text-amber-900 border-[#efa02a]/30' };
      case 'command_viewer':
        return { tag: '03 Command Staff', color: 'bg-[#1d9f76]/20 text-[#0f7058] border-[#1d9f76]/30' };
      case 'admin':
        return { tag: '04 Admin / ML', color: 'bg-stone-500/20 text-[#1E1E1E] border-stone-500/30' };
      default:
        return { tag: 'Standard Access', color: 'bg-[#E3DDCF] text-[#1E1E1E] border-[#D2CBBB]' };
    }
  };

  const roleMeta = getRoleBadge(currentUser?.role);

  return (
    <header id="sahara-header" className="bg-[#E3DDCF] text-[#1E1E1E] border-b border-[#D2CBBB] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Sidebar Toggle + Logo & Platform Context */}
          <div className="flex items-center space-x-3 shrink-0">
            {onToggleSidebar && (
              <button
                id="btn-header-sidebar-toggle"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border border-[#D2CBBB] transition-all cursor-pointer mr-1"
                title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-[#1d9f76]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-[#5E5A52]" />
                )}
              </button>
            )}

            <div
              onClick={onOpenLandingPage}
              className="w-9 h-9 rounded-2xl bg-[#1d9f76]/20 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] shadow-xs cursor-pointer hover:bg-[#1d9f76]/30 transition-colors"
            >
              <Shield className="w-5 h-5 text-[#0f7058]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span
                  onClick={onOpenLandingPage}
                  className="font-extrabold text-[16px] tracking-tight text-[#1E1E1E] font-serif cursor-pointer hover:text-[#0f7058] transition-colors"
                >
                  SAHARA
                </span>
                <span className="h-3 w-px bg-[#D2CBBB] hidden sm:inline-block" />
                <span className="text-[11px] text-[#5E5A52] hidden sm:inline-block font-medium">
                  Health &amp; Welfare Intelligence
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#0f7058] font-medium">
                  {currentUser?.unit || '102nd Mountain Battalion'}
                </span>
                <span className="text-[10px] text-[#5E5A52] font-mono hidden md:inline-block">
                  &bull; {currentUser?.rank || 'Capt'} {currentUser?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls & Sign Out in corner */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick 1-Min Reset */}
            {onOpenTacticalReset && (
              <button
                id="btn-header-tactical-reset"
                onClick={onOpenTacticalReset}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#efa02a] hover:bg-[#efa02a]/90 text-slate-900 border border-[#efa02a] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="1-Minute Guided Box Breathing"
              >
                <Wind className="w-3.5 h-3.5 text-slate-900" />
                <span>1-Min Reset</span>
              </button>
            )}

            {/* WHO Methodology */}
            {onOpenWhoMethodology && (
              <button
                id="btn-header-who-methodology"
                onClick={onOpenWhoMethodology}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border border-[#D2CBBB] text-xs font-medium transition-colors cursor-pointer"
                title="WHO GDHM 4-Pillar Health Standards"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5E5A52]" />
                <span>WHO GDHM</span>
              </button>
            )}

            {/* Executive Dossier */}
            {onOpenExecutiveBrief && (
              <button
                id="btn-header-executive-brief"
                onClick={onOpenExecutiveBrief}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border border-[#D2CBBB] text-xs font-medium transition-colors cursor-pointer"
                title="Export Executive Dossier"
              >
                <FileText className="w-3.5 h-3.5 text-[#0f7058]" />
                <span>Dossier</span>
              </button>
            )}

            {/* Authenticated User Identity & Clearance Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#F4EFE4] border border-[#D2CBBB] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#1d9f76]" />
              <span className="font-bold text-[#1E1E1E] truncate max-w-[130px] sm:max-w-[180px]">
                {currentUser?.rank} {currentUser?.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#5E5A52] font-bold">
                {currentUser?.role === 'personnel' && 'Tier 1 (Self)'}
                {currentUser?.role === 'welfare_officer' && 'Tier 2 (2 Portals)'}
                {currentUser?.role === 'command_viewer' && 'Tier 3 (3 Portals)'}
                {(currentUser?.role === 'admin' || currentUser?.role === 'demo_operator') && 'Tier 4 (All 4 Portals)'}
              </span>
            </div>

            {/* Mobile Simulation Toggle */}
            <button
              id="btn-toggle-mobile-sim"
              onClick={onToggleMobileSim}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isMobileSimulated
                  ? 'bg-[#1d9f76] text-white border-[#1d9f76]'
                  : 'bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] border-[#D2CBBB]'
              }`}
              title={isMobileSimulated ? 'Exit Tactical Mobile Simulation' : 'Simulate Mobile Handheld View'}
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Reset Fixtures */}
            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              className="p-2 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] border border-[#D2CBBB] transition-colors cursor-pointer"
              title="Reset System Fixtures to Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sign Out / Log Out Button in Corner */}
            {onSignOut && (
              <button
                id="btn-header-signout"
                onClick={onSignOut}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Sign Out / Return to Landing Page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
