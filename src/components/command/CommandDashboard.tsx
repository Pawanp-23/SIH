import React, { useState, useEffect } from 'react';
import { UserProfile, UnitAggregateSummary } from '../../types.js';
import { api } from '../../api/client.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Users,
  Clock,
  Moon,
  HeartHandshake,
  Lock,
  AlertTriangle,
  Building2,
  ShieldAlert,
  Info,
  CheckCircle2
} from 'lucide-react';

interface CommandDashboardProps {
  user: UserProfile;
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({ user }) => {
  const [selectedUnit, setSelectedUnit] = useState('unit-102');
  const [summary, setSummary] = useState<UnitAggregateSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async (unitId: string) => {
    setLoading(true);
    try {
      const res = await api.getCommandSummary(unitId);
      if (res.success) {
        setSummary(res.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary(selectedUnit);
  }, [selectedUnit]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Command Strategic Header */}
      <div className="bg-slate-950 text-slate-100 rounded-xl p-6 border border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Sector Command • Operational Readiness &amp; Welfare Overview
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded font-mono bg-blue-950/80 text-blue-300 border border-blue-800/60">
              Clearance: Command Staff
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Authorized oversight of battalion-level duty workload, shift distributions, and aggregate welfare demand.
            Protected by mandatory <strong>k-anonymity privacy suppression ($k \ge 10$)</strong> to prevent individual de-identification.
          </p>
        </div>

        {/* Cohort Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <label htmlFor="select-command-unit" className="text-xs text-slate-400 font-medium">Cohort:</label>
          <select
            id="select-command-unit"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white border-none focus:ring-0 focus:outline-none cursor-pointer pr-2"
          >
            <option value="unit-102" className="bg-slate-900 text-slate-100">
              102nd Mountain Battalion (15 Personnel)
            </option>
            <option value="unit-204" className="bg-slate-900 text-slate-100">
              204th Strike Regiment (15 Personnel)
            </option>
            <option value="unit-099" className="bg-slate-900 text-amber-300 font-bold">
              Detachment Alpha (4 Personnel — Suppressed)
            </option>
          </select>
        </div>
      </div>

      {/* Mandatory Statutory Privacy Notice */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 font-semibold block mb-0.5">
            Non-Punitive Privacy Guarantee (Armed Forces Health Directive §8)
          </strong>
          Command viewports are cryptographically isolated from individual personnel check-in entries, clinical ratings, or individual soldier identities.
          Aggregate statistics for any unit or cohort with fewer than 10 individuals are automatically withheld to safeguard service members.
        </div>
      </div>

      {/* Suppressed vs Authorized Metrics */}
      {summary?.isSuppressed ? (
        /* K-Anonymity Suppression Card */
        <div
          id="suppression-alert-card"
          className="bg-white rounded-xl border border-amber-200/90 shadow-2xs p-10 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Aggregate Reporting Suppressed ($k &lt; 10$)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {summary.suppressionNotice}
            </p>
            <div className="inline-flex items-center text-xs font-mono font-medium text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mt-2">
              Cohort Size: {summary.totalPersonnel} / Minimum Threshold: 10
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2">
            Select an authorized battalion with 10 or more active personnel to review statistical distributions.
          </p>
        </div>
      ) : summary ? (
        /* Authorized Battalion Metrics */
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Participation Rate</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 pt-1">
                {summary.activeCheckinCoverage}%
              </div>
              <span className="text-[11px] text-slate-400 block">
                {summary.totalPersonnel} active personnel reporting
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Avg Daily Shift</span>
                <Clock className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 pt-1">
                {summary.avgDutyHours} <span className="text-sm font-normal text-slate-400">hrs</span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Operational baseline: 8.0 hrs
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Night Watch Personnel</span>
                <Moon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-purple-700 pt-1">
                {summary.consecutiveNightShiftPersonnel}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Active rotation monitoring
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Active Welfare Cases</span>
                <HeartHandshake className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-600 pt-1">
                {summary.openWelfareCases}
              </div>
              <span className="text-[11px] text-slate-400 block">
                {summary.resolvedWelfareCasesThisMonth} resolved this rotation
              </span>
            </div>
          </div>

          {/* Workload & Shift Demand Trends (Recharts) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                  7-Day Cohort Workload &amp; Shift Rotation Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aggregated average duty hours and count of night watch assignments
                </p>
              </div>
              <span className="text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-md">
                Unit: {summary.unitName}
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.workloadTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => val.replace('2026-09-', 'Sep ')}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '12px',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                  <Bar dataKey="avgDutyHours" name="Avg Duty Hours" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="nightShiftCount" name="Night Watch Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
