import React, { useEffect, useState } from 'react';
import { ForceWelfareOverview, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  RefreshCw,
  Flame,
  Info,
  BookOpen,
  FileText,
  Filter,
  Sparkles,
  Wind,
  ShieldCheck
} from 'lucide-react';

interface CommandOverviewScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
  onOpenMethodology?: () => void;
  onOpenExecBrief?: () => void;
  onOpenTacticalReset?: () => void;
}

export const CommandOverviewScreen: React.FC<CommandOverviewScreenProps> = ({
  onNavigateScreen,
  onOpenMethodology,
  onOpenExecBrief,
  onOpenTacticalReset
}) => {
  const [overview, setOverview] = useState<ForceWelfareOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [plainEnglishMode, setPlainEnglishMode] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getForceOverview();
      if (res.success) {
        setOverview(res.overview);
      }
    } catch (err) {
      console.error('Failed to load force overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !overview) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium">Synthesizing Force Health &amp; Welfare Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="screen-command-overview">
      {/* Headspace-Inspired Warm Welcoming Hero Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Soft Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200/80">
              WHO GDHM BENCHMARK &bull; SCREEN 01
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Force Welfare &amp; Readiness Pulse
          </h1>

          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Continuous health intelligence across <strong className="text-slate-900 font-semibold">{overview.totalMonitored.toLocaleString()} active personnel</strong>.
            Detects fatigue velocity and circadian strain early so commanders can authorize rest before operational burnout occurs.
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Section 14 Non-Punitive Medical Privilege</span>
            </span>
            <span>&bull;</span>
            <span className="font-mono">k &ge; 10 Anonymity Enforced</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 flex flex-wrap lg:flex-nowrap items-center gap-2.5 shrink-0">
          {onOpenTacticalReset && (
            <button
              id="btn-hero-reset"
              onClick={onOpenTacticalReset}
              className="flex items-center gap-2 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Wind className="w-4 h-4 text-orange-600" />
              <span>1-Min Tactical Reset</span>
            </button>
          )}

          {onOpenMethodology && (
            <button
              id="btn-hero-methodology"
              onClick={onOpenMethodology}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Methodology Guide</span>
            </button>
          )}

          {onOpenExecBrief && (
            <button
              id="btn-hero-exec-brief"
              onClick={onOpenExecBrief}
              className="flex items-center gap-2 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Export Brief</span>
            </button>
          )}

          <button
            id="btn-goto-unit-heatmap"
            onClick={() => onNavigateScreen('unit_intelligence')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold cursor-pointer shadow-sm transition-all"
          >
            <span>Unit Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WHO GDHM Strategic Pillars Banner (4 Core Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Pillar 1: Readiness */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Pillar I: Force Readiness</span>
              <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold">&ge;85% Target</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
              {overview.readinessScore}%
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            +3.4% above operational threshold
          </div>
        </div>

        {/* Pillar 2: Low Risk Stability */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
              <span className="font-semibold">Pillar II: Thriving Baseline</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-800 font-mono tracking-tight mt-1">
              {overview.lowRisk.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-2">
            77.7% in sustainable circadian routine
          </div>
        </div>

        {/* Pillar 3: Strain Watchlist */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
              <span className="font-semibold">Pillar III: Preventative Watch</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-800 font-mono tracking-tight mt-1">
              {overview.moderateRisk.toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-2">
            17.3% emerging fatigue &bull; Early peer check-in
          </div>
        </div>

        {/* Pillar 4: Action Review & Critical Alerts */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-rose-800 mb-1">
              <span className="font-semibold">Pillar IV: Active Triage</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div className="text-3xl font-extrabold text-rose-800 font-mono tracking-tight mt-1">
              {overview.criticalTrendAlerts}
            </div>
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-2">
            {overview.highRisk} personnel in review &bull; 17 critical velocity
          </div>
        </div>
      </div>

      {/* Disaggregation & Formation Filters (WHO GDHM standard) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 shrink-0 pl-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Formation:
          </span>
          {[
            { id: 'all', label: 'All Units (1,842)' },
            { id: '102', label: '102nd Mountain (780)' },
            { id: '204', label: '204th Strike (420)' },
            { id: '501', label: '501st Air Def (360)' },
            { id: '7th', label: '7th Recon (210)' },
            { id: 'alpha', label: 'Detachment Alpha (Protected)' }
          ].map((formation) => (
            <button
              key={formation.id}
              onClick={() => setSelectedFormation(formation.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFormation === formation.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
              }`}
            >
              {formation.label}
            </button>
          ))}
        </div>

        {/* Plain English vs Statistical View Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setPlainEnglishMode(!plainEnglishMode)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              plainEnglishMode
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-stone-100 text-slate-700 border-stone-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{plainEnglishMode ? 'Plain-English View' : 'Statistical View'}</span>
          </button>
        </div>
      </div>

      {/* Primary Intelligence Section: Stacked Distribution & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Force-Wide Health &amp; Welfare Stratification
              </h2>
              <p className="text-xs text-slate-500">
                {plainEnglishMode
                  ? 'Overview of personnel categorized by sleep sustainability and duty load'
                  : 'Stratification based on TreeSHAP additive feature vectors across census'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Force Vitality</div>
              <div className="text-lg font-black text-slate-900 font-mono">{overview.readinessScore}%</div>
            </div>
          </div>

          {/* Segmented Stacked Bar */}
          <div className="space-y-1.5">
            <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200">
              <div
                style={{ width: `${(overview.lowRisk / overview.totalMonitored) * 100}%` }}
                className="bg-emerald-500 h-full rounded-l-full transition-all"
                title={`Routine: ${overview.lowRisk}`}
              />
              <div
                style={{ width: `${(overview.moderateRisk / overview.totalMonitored) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Watch: ${overview.moderateRisk}`}
              />
              <div
                style={{ width: `${(overview.highRisk / overview.totalMonitored) * 100}%` }}
                className="bg-rose-500 h-full rounded-r-full transition-all"
                title={`Review: ${overview.highRisk}`}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100% Census</span>
            </div>
          </div>

          {/* Friendly Headspace-Style Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Thriving (Routine)
                </span>
                <span className="font-mono font-extrabold text-sm text-emerald-800">1,432</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                Rested (&gt;7h sleep). Operating within normal watch rotations and resilient morale.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Strain (Watch)
                </span>
                <span className="font-mono font-extrabold text-sm text-amber-800">318</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Emerging sleep shortfall or &gt;10h shifts. Preventative buddy check-in recommended.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Rest Needed (Review)
                </span>
                <span className="font-mono font-extrabold text-sm text-rose-800">92</span>
              </div>
              <p className="text-[11px] text-rose-900/80 leading-relaxed">
                Severe sleep debt + night duties. Welfare Officer case triage and rest swap activated.
              </p>
            </div>
          </div>

          {/* 7-Day Velocity Chart */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Alert Velocity &amp; Resolution Trajectory (Past 7 Days)
              </span>
              <span className="text-slate-500 font-mono">Net Triage Queue: 17</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-mono">
              {overview.alertVelocity.map((day) => (
                <div key={day.date} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="text-[10px] text-slate-500 font-sans mb-1">{day.date}</div>
                  <div className="text-xs font-bold text-rose-700">+{day.newAlerts}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">-{day.resolved}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Systemic Workload Hotspots (WHO Epidemiological Cluster Detection) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-rose-700">
              <Flame className="w-4 h-4" />
              <h2 className="text-base font-bold text-slate-900">Systemic Strain Hotspots</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              AI detects clusters where collective fatigue risk exceeds operational safety limits.
            </p>

            <div className="space-y-3">
              {overview.systemicHotspots.map((hotspot, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{hotspot.unitName}</span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        hotspot.riskScore >= 65
                          ? 'bg-rose-100 text-rose-800'
                          : hotspot.riskScore >= 45
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Risk {hotspot.riskScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{hotspot.primaryFactor}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigateScreen('unit_intelligence')}
              className="text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Battalion Heatmaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400 font-mono text-[11px]">k &ge; 10 Guard</span>
          </div>
        </div>
      </div>

      {/* End-to-End Walkthrough Bar (Headspace Guided Journey Feel) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                7-STEP EXPLAINABLE JOURNEY
              </span>
              <span className="text-xs text-slate-400">Step 1 of 7 in Operational Intelligence</span>
            </div>
            <h3 className="text-base font-bold text-white">Next Step: Inspect Unit Heatmaps</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Drill down into formation-level fatigue matrices, see how Detachment Alpha is protected under k-anonymity, and then examine Constable Rajesh Verma&apos;s individual TreeSHAP explanation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateScreen('unit_intelligence')}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Explore Unit Heatmaps (Screen 02)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
