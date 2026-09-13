import React, { useState } from 'react';
import { UserProfile } from '../../types.js';
import {
  Shield,
  Heart,
  Activity,
  UserCheck,
  Stethoscope,
  TrendingUp,
  Sliders,
  Cpu,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wind,
  BookOpen,
  FileText,
  Calendar,
  ClipboardList,
  AlertTriangle,
  Flame,
  Clock,
  ShieldAlert,
  Database,
  TrendingDown,
  FileCheck,
  Key,
  ChevronDown,
  Layers
} from 'lucide-react';

export type RolePortalId = 'personnel' | 'welfare' | 'commander' | 'admin';

interface SidebarProps {
  activePortal: RolePortalId;
  onSelectPortal: (portal: RolePortalId) => void;
  activeSubTab?: string;
  onSelectSubTab: (portal: RolePortalId, subTab: string) => void;
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
  activePortal,
  onSelectPortal,
  activeSubTab,
  onSelectSubTab,
  currentUser,
  onSwitchUser,
  onSignOut,
  isCollapsed,
  onToggleCollapse,
  criticalAlertsCount = 3,
  openCasesCount = 14,
  onOpenTacticalReset,
  onOpenWhoMethodology,
  onOpenExecutiveBrief,
  onOpenLandingPage,
  onOpenDemoGuide
}) => {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<RolePortalId, boolean>>({
    personnel: true,
    welfare: true,
    commander: true,
    admin: true
  });

  const toggleSection = (portal: RolePortalId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [portal]: !prev[portal]
    }));
  };

  // Hierarchical Role-Based Access Control (RBAC):
  // 1. Personnel (Service Member): Can only view themself (1 portal: 'personnel')
  // 2. Welfare Officer: Can view only 2 portals ('personnel' and 'welfare')
  // 3. Commander: Can view all 3 portals ('personnel', 'welfare', 'commander')
  // 4. Admin: Can view all 4 portals ('personnel', 'welfare', 'commander', 'admin')
  const getAllowedPortals = (role?: string): RolePortalId[] => {
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

  const allowedPortals = getAllowedPortals(currentUser?.role);

  const portalConfigs = [
    {
      id: 'personnel' as RolePortalId,
      number: '01',
      title: 'PERSONNEL PORTAL',
      badge: 'Protected',
      badgeColor: 'bg-[#1d9f76]/20 text-[#0f7058] border-[#1d9f76]/30',
      icon: Heart,
      subItems: [
        { id: 'checkin', label: 'Wellness check-in', icon: Calendar },
        { id: 'wellbeing', label: 'My wellbeing', icon: TrendingUp },
        { id: 'assessment', label: 'Assessment', icon: ClipboardList },
        { id: 'recovery', label: 'Recovery recommendations', icon: Wind },
        { id: 'assistance', label: 'Confidential assistance', icon: Sparkles },
        { id: 'privacy', label: 'Privacy controls', icon: Lock }
      ]
    },
    {
      id: 'welfare' as RolePortalId,
      number: '02',
      title: 'WELFARE OFFICER',
      badge: '3 Alerts',
      badgeColor: 'bg-rose-500/20 text-rose-800 border-rose-500/30',
      icon: Stethoscope,
      subItems: [
        { id: 'risk_overview', label: 'Risk overview', icon: Activity },
        { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
        { id: 'profile', label: 'Personnel profile', icon: UserCheck },
        { id: 'risk_history', label: 'Risk history', icon: TrendingUp },
        { id: 'shap', label: 'SHAP explanation', icon: Sliders },
        { id: 'recommendations', label: 'Recommendations', icon: BookOpen },
        { id: 'interventions', label: 'Interventions', icon: Stethoscope }
      ]
    },
    {
      id: 'commander' as RolePortalId,
      number: '03',
      title: 'COMMANDER',
      badge: 'k ≥ 10',
      badgeColor: 'bg-[#1d9f76]/20 text-[#0f7058] border-[#1d9f76]/30',
      icon: ShieldAlert,
      subItems: [
        { id: 'unit_readiness', label: 'Unit readiness', icon: Activity },
        { id: 'aggregate_trends', label: 'Aggregate trends', icon: TrendingUp },
        { id: 'workload', label: 'Workload', icon: Clock },
        { id: 'deployment_stress', label: 'Deployment stress', icon: Flame },
        { id: 'alerts', label: 'High-level alerts', icon: ShieldAlert },
        { id: 'reports', label: 'Reports', icon: FileText }
      ]
    },
    {
      id: 'admin' as RolePortalId,
      number: '04',
      title: 'ADMIN / ML',
      badge: 'Active',
      badgeColor: 'bg-[#efa02a]/20 text-amber-900 border-[#efa02a]/30',
      icon: Cpu,
      subItems: [
        { id: 'model_monitoring', label: 'Model monitoring', icon: Cpu },
        { id: 'dataset_health', label: 'Dataset health', icon: Database },
        { id: 'drift', label: 'Drift', icon: TrendingDown },
        { id: 'accuracy', label: 'Accuracy', icon: Activity },
        { id: 'feature_importance', label: 'Feature importance', icon: Sliders },
        { id: 'audit_logs', label: 'Audit logs', icon: FileCheck },
        { id: 'permissions', label: 'Permissions', icon: Key }
      ]
    }
  ];

  // Strictly filter only portals permitted for this authenticated role
  const visiblePortalConfigs = portalConfigs.filter((p) => allowedPortals.includes(p.id));

  return (
    <aside
      id="dashboard-sidebar"
      className={`bg-[#E3DDCF] text-[#1E1E1E] border-r border-[#D2CBBB] flex flex-col justify-between shrink-0 transition-all duration-300 relative select-none z-30 h-screen sticky top-0 shadow-sm ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Top Header & Branding */}
      <div className="flex flex-col shrink-0">
        <div className="p-4 border-b border-[#D2CBBB] flex items-center justify-between">
          <div
            onClick={onOpenLandingPage}
            className={`flex items-center space-x-3 cursor-pointer group ${isCollapsed ? 'justify-center w-full' : ''}`}
            title="Return to SAHARA Overview"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1d9f76]/20 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] group-hover:bg-[#1d9f76]/30 transition-all shadow-xs shrink-0">
              <Shield className="w-5 h-5 text-[#0f7058] group-hover:scale-105 transition-transform" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base tracking-tight text-[#1E1E1E] font-serif">SAHARA</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                    Armed Forces
                  </span>
                </div>
                <span className="text-[10px] text-[#5E5A52] truncate">Health &amp; Welfare Platform</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              id="btn-collapse-sidebar"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] border border-[#D2CBBB] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {isCollapsed && (
          <div className="p-2 border-b border-[#D2CBBB] flex justify-center">
            <button
              id="btn-expand-sidebar"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] hover:text-[#1E1E1E] border border-[#D2CBBB] transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Role Quick Selector / Switcher */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[#D2CBBB] bg-[#F4EFE4]/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E5A52] px-1 mb-1.5 font-bold flex items-center justify-between">
              <span>{visiblePortalConfigs.length > 1 ? 'Authorized Portals' : 'Clearance Scope'}</span>
              <span className="text-[10px] text-[#0f7058] font-bold">
                {visiblePortalConfigs.length} {visiblePortalConfigs.length === 1 ? 'Portal (Self)' : 'Portals'}
              </span>
            </div>
            {visiblePortalConfigs.length > 1 ? (
              <div className={`grid ${visiblePortalConfigs.length === 2 ? 'grid-cols-2' : visiblePortalConfigs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5`}>
                {visiblePortalConfigs.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPortal(p.id)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 border ${
                      activePortal === p.id
                        ? 'bg-[#1d9f76] text-white border-[#1d9f76] shadow-xs'
                        : 'bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                    }`}
                  >
                    <p.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[10px]">{p.number} {p.id.charAt(0).toUpperCase() + p.id.slice(1)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-2.5 py-1.5 rounded-xl bg-[#E3DDCF] border border-[#D2CBBB] text-[11px] font-semibold text-[#0f7058] flex items-center space-x-2">
                <Heart className="w-3.5 h-3.5 text-[#1d9f76]" />
                <span className="truncate">Tier 1: Personal Records Only</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation List: Filtered strictly by Active Role Permissions */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-[#D2CBBB]">
        {visiblePortalConfigs.map((portal) => {
          const isCurrentPortal = activePortal === portal.id;
          const isExpanded = isCollapsed ? false : expandedSections[portal.id];
          const Icon = portal.icon;

          return (
            <div
              key={portal.id}
              className={`rounded-2xl border transition-all ${
                isCurrentPortal
                  ? 'border-[#1d9f76]/40 bg-[#F4EFE4] shadow-xs'
                  : 'border-transparent hover:border-[#D2CBBB]'
              }`}
            >
              {/* Role Header Button */}
              <button
                onClick={() => {
                  onSelectPortal(portal.id);
                  if (!isCollapsed && !expandedSections[portal.id]) {
                    toggleSection(portal.id);
                  }
                }}
                className={`w-full text-left p-2.5 rounded-2xl flex items-center transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } ${
                  isCurrentPortal
                    ? 'bg-[#1d9f76] text-white'
                    : 'text-[#1E1E1E] hover:bg-[#F4EFE4]'
                }`}
                title={isCollapsed ? `${portal.number} ${portal.title}` : undefined}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrentPortal
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E3DDCF] text-[#5E5A52]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && (
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-mono font-bold ${isCurrentPortal ? 'text-white/80' : 'text-[#0f7058]'}`}>
                          {portal.number}
                        </span>
                        <span className="text-xs font-bold truncate">
                          {portal.title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      isCurrentPortal
                        ? 'bg-white/20 text-white border-white/30'
                        : portal.badgeColor
                    }`}
                  >
                    {portal.badge}
                  </span>
                )}
              </button>

              {/* Sub-Items Tree (when expanded and not collapsed) */}
              {!isCollapsed && isExpanded && (
                <div className="px-2 py-1.5 space-y-0.5 border-t border-[#D2CBBB]/60 mt-1">
                  {portal.subItems.map((sub, idx) => {
                    const isSubActive = isCurrentPortal && activeSubTab === sub.id;
                    const SubIcon = sub.icon;
                    const isLast = idx === portal.subItems.length - 1;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onSelectPortal(portal.id);
                          onSelectSubTab(portal.id, sub.id);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-2 ${
                          isSubActive
                            ? 'bg-[#1d9f76]/15 text-[#0f7058] font-bold border border-[#1d9f76]/30'
                            : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#E3DDCF]'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-[#5E5A52] opacity-70">
                          {isLast ? '└──' : '├──'}
                        </span>
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-[#0f7058]' : 'text-[#5E5A52]'}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Supportive Protocols Quick Access */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-[#D2CBBB]/70 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E5A52] px-2 mb-1 font-bold">
              Supportive Protocols
            </div>

            <button
              onClick={onOpenTacticalReset}
              className="w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-semibold text-[#1E1E1E] hover:bg-[#F4EFE4] flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5 text-[#efa02a]" />
              <span>1-Min Box Breathing Reset</span>
            </button>

            <button
              onClick={onOpenWhoMethodology}
              className="w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-semibold text-[#1E1E1E] hover:bg-[#F4EFE4] flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5E5A52]" />
              <span>WHO GDHM Methodology</span>
            </button>

            <button
              onClick={onOpenExecutiveBrief}
              className="w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-semibold text-[#1E1E1E] hover:bg-[#F4EFE4] flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#0f7058]" />
              <span>Executive Brief Dossier</span>
            </button>

            <button
              onClick={onOpenLandingPage}
              className="w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-semibold text-[#1E1E1E] hover:bg-[#F4EFE4] flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1d9f76]" />
              <span>Landing Page &amp; Overview</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Corner: Dedicated Sign Out / Log Out Option with Confirmation */}
      <div className="p-3 border-t border-[#D2CBBB] bg-[#F4EFE4] shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2">
            {/* User Details Card */}
            <div className="p-2.5 rounded-2xl bg-[#E3DDCF] border border-[#D2CBBB] flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[#1d9f76]/20 text-[#0f7058] flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.name?.charAt(0) || 'P'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#1E1E1E] truncate">{currentUser?.name}</div>
                  <div className="text-[10px] text-[#5E5A52] truncate font-mono">
                    {currentUser?.rank} &bull; {currentUser?.unit}
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Sign Out / Log Out Button in Corner */}
            {!showSignOutConfirm ? (
              <button
                id="btn-sidebar-signout"
                onClick={() => setShowSignOutConfirm(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                title="Sign Out / Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out / Log Out</span>
              </button>
            ) : (
              <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-center space-y-1.5 animate-fadeIn">
                <span className="text-[11px] font-bold text-rose-800 block">Sign out of session?</span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={onSignOut}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Sign Out
                  </button>
                  <button
                    onClick={() => setShowSignOutConfirm(false)}
                    className="px-2.5 py-1 rounded-lg bg-[#E3DDCF] text-[#5E5A52] text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={onSignOut}
              className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
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
