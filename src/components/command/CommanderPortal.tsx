import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Flame,
  Info,
  BookOpen,
  FileText,
  Filter,
  Sparkles,
  Wind,
  ShieldCheck,
  BarChart2,
  Clock,
  Briefcase,
  Compass
} from 'lucide-react';
import { api } from '../../api/client.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';

interface CommanderPortalProps {
  initialSubTab?: 'unit_readiness' | 'aggregate_trends' | 'workload' | 'deployment_stress' | 'alerts' | 'reports';
  onOpenExecBrief?: () => void;
  onOpenMethodology?: () => void;
  onOpenTacticalReset?: () => void;
}

export const CommanderPortal: React.FC<CommanderPortalProps> = ({
  initialSubTab = 'unit_readiness',
  onOpenExecBrief,
  onOpenMethodology,
  onOpenTacticalReset
}) => {
  const [activeTab, setActiveTab] = useState<
    'unit_readiness' | 'aggregate_trends' | 'workload' | 'deployment_stress' | 'alerts' | 'reports'
  >(initialSubTab);

  const [overview, setOverview] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ovRes, hmRes] = await Promise.all([
          api.getForceOverview(),
          api.getUnitIntelligence()
        ]);
        if (ovRes.success) setOverview(ovRes.overview);
        if (hmRes.success) setHeatmap(hmRes.units);
      } catch (err) {
        console.error('Failed to load commander portal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const workloadData = [
    { company: 'Alpha Coy (Rifle)', avgDutyHours: 9.8, nightShifts: 18, strainIndex: 48 },
    { company: 'Bravo Coy (High Altitude)', avgDutyHours: 12.4, nightShifts: 34, strainIndex: 72 },
    { company: 'Charlie Coy (Support)', avgDutyHours: 8.5, nightShifts: 12, strainIndex: 38 },
    { company: 'HQ & Signals', avgDutyHours: 10.1, nightShifts: 22, strainIndex: 56 }
  ];

  const trendsData = [
    { day: 'Sep 06', Alpha: 42, Bravo: 60, Charlie: 35 },
    { day: 'Sep 07', Alpha: 44, Bravo: 65, Charlie: 36 },
    { day: 'Sep 08', Alpha: 46, Bravo: 68, Charlie: 37 },
    { day: 'Sep 09', Alpha: 47, Bravo: 70, Charlie: 38 },
    { day: 'Sep 10', Alpha: 48, Bravo: 74, Charlie: 37 },
    { day: 'Sep 11', Alpha: 49, Bravo: 73, Charlie: 39 },
    { day: 'Sep 12', Alpha: 48, Bravo: 72, Charlie: 38 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1E1E1E]">
      {/* Top Welcome Banner */}
      <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight font-serif text-[#1E1E1E]">
                03 Commander Portal
              </span>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                k &ge; 10 Aggregation Enforced
              </span>
            </div>
            <p className="text-xs text-[#5E5A52] leading-relaxed max-w-2xl">
              Battalion-level operational readiness, circadian strain distribution, and systemic burnout risk mitigation without breaching service member medical privilege.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenExecBrief && (
              <button
                onClick={onOpenExecBrief}
                className="px-4 py-2 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6 Exact Sub-Sections Tabs Header */}
      <div className="bg-[#E3DDCF] p-1.5 rounded-2xl border border-[#D2CBBB] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('unit_readiness')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'unit_readiness'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Unit readiness</span>
        </button>

        <button
          onClick={() => setActiveTab('aggregate_trends')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'aggregate_trends'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Aggregate trends</span>
        </button>

        <button
          onClick={() => setActiveTab('workload')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'workload'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Workload</span>
        </button>

        <button
          onClick={() => setActiveTab('deployment_stress')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'deployment_stress'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Deployment stress</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>High-level alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Reports</span>
        </button>
      </div>

      {/* 1. UNIT READINESS */}
      {activeTab === 'unit_readiness' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Combat Readiness Index</span>
              <span className="text-3xl font-extrabold font-serif text-[#0f7058]">86.4%</span>
              <p className="text-[11px] text-[#0f7058] mt-1">&ge; 80% Operational Standard Met</p>
            </div>
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Total Monitored Strength</span>
              <span className="text-3xl font-extrabold font-serif text-[#1E1E1E]">1,842</span>
              <p className="text-[11px] text-[#5E5A52] mt-1">102nd Mountain &amp; Attached</p>
            </div>
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Critical Fatigue Proportion</span>
              <span className="text-3xl font-extrabold font-serif text-rose-700">4.9%</span>
              <p className="text-[11px] text-rose-800 mt-1">92 personnel in review band</p>
            </div>
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Active Rest Interventions</span>
              <span className="text-3xl font-extrabold font-serif text-[#efa02a]">14</span>
              <p className="text-[11px] text-amber-900 mt-1">48-hour rotations granted</p>
            </div>
          </div>

          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base font-serif text-[#1E1E1E]">Company Readiness Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workloadData.map((co, idx) => (
                <div key={idx} className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1E1E1E]">{co.company}</h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        co.strainIndex > 65
                          ? 'bg-rose-500/20 text-rose-800 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30'
                      }`}
                    >
                      Strain {co.strainIndex}/100
                    </span>
                  </div>
                  <div className="text-xs text-[#5E5A52] flex justify-between">
                    <span>Avg Shift: {co.avgDutyHours} hrs/day</span>
                    <span>Night Shift Sentry Ratio: {co.nightShifts}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AGGREGATE TRENDS */}
      {activeTab === 'aggregate_trends' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Battalion Strain Velocity (7-Day Multi-Company Trajectory)
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Comparing Alpha Coy (Rifle), Bravo Coy (High Altitude), and Charlie Coy (Support).
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#5E5A52' }} />
                <YAxis domain={[20, 90]} tick={{ fontSize: 11, fill: '#5E5A52' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    color: '#F4EFE4',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine y={65} stroke="#e11d48" strokeDasharray="4 4" label="Review (65)" />
                <Line type="monotone" dataKey="Bravo" stroke="#e11d48" strokeWidth={2.5} name="Bravo Coy (High Alt)" />
                <Line type="monotone" dataKey="Alpha" stroke="#1d9f76" strokeWidth={2} name="Alpha Coy (Rifle)" />
                <Line type="monotone" dataKey="Charlie" stroke="#efa02a" strokeWidth={2} name="Charlie Coy (Support)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-[#5E5A52] pt-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-rose-600 rounded" /> Bravo Coy (Elevated Strain)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#1d9f76] rounded" /> Alpha Coy (Routine)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#efa02a] rounded" /> Charlie Coy (Watch)</span>
          </div>
        </div>
      )}

      {/* 3. WORKLOAD */}
      {activeTab === 'workload' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Duty Load &amp; Circadian Shift Balance
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Identifying units with consecutive duty exceeding 12 hours/day and night shift clusters.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" vertical={false} />
                <XAxis dataKey="company" tick={{ fontSize: 10, fill: '#1E1E1E' }} />
                <YAxis tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    color: '#F4EFE4',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="avgDutyHours" fill="#1d9f76" radius={[6, 6, 0, 0]} name="Avg Duty Hours" />
                <Bar dataKey="nightShifts" fill="#efa02a" radius={[6, 6, 0, 0]} name="Night Shift %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. DEPLOYMENT STRESS */}
      {activeTab === 'deployment_stress' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Environmental &amp; High-Altitude Deployment Load
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Assessing hypobaric hypoxia, thermal strain, and isolation duration across forward sentry posts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-sm text-[#1E1E1E]">Sector 4 North (12,200 ft - Glacier Line)</h4>
              <p className="text-xs text-[#5E5A52]">
                Thermal deficit -14&deg;C. Average deployment span is currently 42 days without rotation.
              </p>
              <div className="text-[11px] font-mono text-rose-700 font-bold">
                Fatigue Multiplier: 1.8x Standard
              </div>
            </div>

            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-sm text-[#1E1E1E]">Sector 2 South (Pass Reconnaissance)</h4>
              <p className="text-xs text-[#5E5A52]">
                Patrol frequency 3 runs per week. Sustained elevation changes of 1,200m per cycle.
              </p>
              <div className="text-[11px] font-mono text-[#0f7058] font-bold">
                Fatigue Multiplier: 1.2x Standard
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HIGH-LEVEL ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Systemic Battalion Burnout Warnings
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Cohort-level threshold alerts aggregated to prevent single-soldier identification.
          </p>

          <div className="space-y-3">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Bravo Coy Sentry Fatigue Cluster</h4>
                <p className="text-xs text-rose-800">
                  Over 32% of service members in Bravo Coy have accumulated &gt;16 hours of sleep deficit over the past 5 shifts. Recommend immediate shift rescheduling.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Communications Night Watch Density</h4>
                <p className="text-xs text-amber-800">
                  Signals detachment reporting 4 consecutive night rotations for 12 technicians. Pacing adjustment suggested under SOP 4.2.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Exportable Sector Dossiers &amp; Intelligence Briefs
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Generated under WHO GDHM (Global Digital Health Monitor) 4-pillar guidelines.
          </p>

          <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1E1E1E]">WHO Sector Readiness Intelligence Brief (Q3 2026)</h4>
              <p className="text-xs text-[#5E5A52]">
                Includes battalion cohort charts, k-anonymity compliance certification, and sleep debt forecasts.
              </p>
            </div>
            {onOpenExecBrief && (
              <button
                onClick={onOpenExecBrief}
                className="px-4 py-2 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                View Full Brief
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
