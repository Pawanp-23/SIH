import React from 'react';
import { ScreenId } from '../../types.js';
import {
  ShieldAlert,
  Activity,
  UserCheck,
  Stethoscope,
  Sliders,
  Cpu,
  Lock
} from 'lucide-react';

interface ScreenNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  criticalAlertsCount?: number;
  openCasesCount?: number;
}

export const ScreenNav: React.FC<ScreenNavProps> = ({
  currentScreen,
  onSelectScreen,
  criticalAlertsCount = 17,
  openCasesCount = 2
}) => {
  const screens: Array<{
    id: ScreenId;
    label: string;
    sublabel: string;
    badge?: string | number;
    badgeColor?: string;
    icon: React.ComponentType<{ className?: string }>;
    stepNumber: string;
  }> = [
    {
      id: 'command_overview',
      label: 'Force Pulse',
      sublabel: 'WHO Executive Overview',
      stepNumber: '01',
      badge: `${criticalAlertsCount} Alerts`,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
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
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: UserCheck
    },
    {
      id: 'intervention_assistant',
      label: 'Care Protocols',
      sublabel: 'Evidence-Grounded RAG',
      stepNumber: '04',
      badge: `${openCasesCount} Active`,
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Stethoscope
    },
    {
      id: 'what_if_simulator',
      label: 'Recovery Sandbox',
      sublabel: 'What-If Simulation',
      stepNumber: '05',
      badge: 'Interactive',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Sliders
    },
    {
      id: 'model_monitoring',
      label: 'Model Trust',
      sublabel: 'Observability & Drift',
      stepNumber: '06',
      badge: 'v1.2 OK',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Cpu
    },
    {
      id: 'audit_privacy',
      label: 'Privacy Enclave',
      sublabel: 'k-Anonymity & Audit',
      stepNumber: '07',
      badge: 'Protected',
      badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
      icon: Lock
    }
  ];

  return (
    <div className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {screens.map((screen) => {
              const Icon = screen.icon;
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  id={`nav-screen-${screen.id}`}
                  onClick={() => onSelectScreen(screen.id)}
                  className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-stone-50 text-slate-700 hover:text-slate-900 border-stone-200/80 shadow-2xs'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                    }`}
                  >
                    {screen.stepNumber}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <span className="font-semibold block leading-tight">{screen.label}</span>
                  </div>
                  {screen.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive ? 'bg-slate-800 text-slate-200 border-slate-700' : screen.badgeColor
                      }`}
                    >
                      {screen.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500 font-mono pl-4 border-l border-stone-200 min-w-max">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>XGBoost v1.2 &bull; 95% CI Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
