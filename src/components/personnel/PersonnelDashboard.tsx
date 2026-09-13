import React, { useState, useEffect } from 'react';
import { UserProfile, DailyCheckinInput, AssessmentResult } from '../../types.js';
import { api } from '../../api/client.js';
import { StatusBadge } from '../common/StatusBadge.js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  Lock,
  Calendar,
  Moon,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  Heart,
  Wind,
  FileCheck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TacticalResetModal } from '../common/TacticalResetModal.js';

interface PersonnelDashboardProps {
  user: UserProfile;
  onRefreshUser: () => void;
}

export const PersonnelDashboard: React.FC<PersonnelDashboardProps> = ({ user, onRefreshUser }) => {
  const [trends, setTrends] = useState<any[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTacticalResetOpen, setIsTacticalResetOpen] = useState(false);

  // Form State
  const [formDate, setFormDate] = useState('2026-09-12');
  const [sleepHours, setSleepHours] = useState<number>(5.5);
  const [stress, setStress] = useState<number>(3);
  const [fatigue, setFatigue] = useState<number>(3);
  const [dutyHours, setDutyHours] = useState<number>(10);
  const [nightShift, setNightShift] = useState<boolean>(false);
  const [supportRequested, setSupportRequested] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  const loadTrends = async () => {
    setLoading(true);
    try {
      const res = await api.getTrends();
      if (res.success) {
        setTrends(res.history);
        setLatestAssessment(res.latestAssessment);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
    setSubmitMessage(null);
    setErrorMessage(null);
  }, [user.id]);

  const handleToggleConsent = async () => {
    try {
      const res = await api.setConsent(!user.hasConsented);
      if (res.success) {
        onRefreshUser();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update consent settings');
    }
  };

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);
    setErrorMessage(null);

    const payload: DailyCheckinInput = {
      date: formDate,
      sleepHours,
      perceivedStress: stress,
      perceivedFatigue: fatigue,
      dutyHours,
      nightShift,
      supportRequested,
      notes
    };

    try {
      const res = await api.submitCheckin(payload);
      if (res.success) {
        setSubmitMessage(`Health log registered. Index: ${res.assessment.index}/100 (${res.assessment.band.toUpperCase()})`);
        setLatestAssessment(res.assessment);
        loadTrends();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Log submission failed. Please verify entries.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Tactical Breathing Modal */}
      <TacticalResetModal
        isOpen={isTacticalResetOpen}
        onClose={() => setIsTacticalResetOpen(false)}
      />

      {/* Headspace-Inspired Supportive Welcoming Banner */}
      <div
        id="personnel-consent-banner"
        className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5 shadow-2xs">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Welcome, {user.alias}
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono bg-stone-100 text-slate-700 border border-stone-200">
                  {user.unit || '102nd Mountain Battalion'}
                </span>
                <span className="inline-flex items-center text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Section 14 Medical Privilege
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                Take 30 seconds to record your sleep and fatigue. Your individual feelings are confidential: commanders only see unit-wide anonymized averages ($k \ge 10$).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            {/* 1-Min Reset Button */}
            <button
              onClick={() => setIsTacticalResetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-all cursor-pointer shadow-2xs"
            >
              <Wind className="w-3.5 h-3.5 text-orange-600" />
              <span>1-Min Reset</span>
            </button>

            <button
              id="btn-toggle-consent"
              onClick={handleToggleConsent}
              className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                user.hasConsented
                  ? 'bg-stone-100 hover:bg-stone-200 text-slate-700 border-stone-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-xs'
              }`}
            >
              {user.hasConsented ? 'Consent Active' : 'Enable Support'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Assessment / Trends (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daily Check-in Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base tracking-tight flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  Daily Wellbeing Check-In
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Quick confidential morning reflection</p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-600 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full">
                {formDate}
              </span>
            </div>

            {submitMessage && (
              <div
                id="checkin-success-msg"
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2.5 shrink-0 text-emerald-600" />
                <span>{submitMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                id="checkin-error-msg"
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2.5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Date
                </label>
                <input
                  id="input-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs rounded-xl border-stone-200 bg-stone-50/60 p-2.5 border text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Sleep Hours Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-sleep" className="text-xs font-semibold text-slate-700 flex items-center">
                    <Moon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Sleep Duration (Past 24 Hours)
                  </label>
                  <span className="text-xs font-bold font-mono text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {sleepHours.toFixed(1)} hrs
                  </span>
                </div>
                <input
                  id="input-sleep"
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0 hrs</span>
                  <span className="text-slate-500 font-medium">Optimal: 7.0–8.0h</span>
                  <span>12+ hrs</span>
                </div>
              </div>

              {/* Perceived Stress (1 - 5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    How Stressed Do You Feel? (1–5)
                  </label>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    Rating: {stress} / 5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { lvl: 1, label: 'Calm' },
                    { lvl: 2, label: 'Stable' },
                    { lvl: 3, label: 'Strained' },
                    { lvl: 4, label: 'High' },
                    { lvl: 5, label: 'Severe' }
                  ].map(({ lvl, label }) => (
                    <button
                      key={`stress-${lvl}`}
                      id={`btn-stress-${lvl}`}
                      type="button"
                      onClick={() => setStress(lvl)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        stress === lvl
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
                      }`}
                    >
                      <div className="font-bold">{lvl}</div>
                      <div className={`text-[9px] truncate ${stress === lvl ? 'text-slate-300' : 'text-slate-500'}`}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceived Fatigue (1 - 5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Physical Energy Level (1–5)
                  </label>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    Rating: {fatigue} / 5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { lvl: 1, label: 'Energized' },
                    { lvl: 2, label: 'Fine' },
                    { lvl: 3, label: 'Tired' },
                    { lvl: 4, label: 'Drained' },
                    { lvl: 5, label: 'Exhausted' }
                  ].map(({ lvl, label }) => (
                    <button
                      key={`fatigue-${lvl}`}
                      id={`btn-fatigue-${lvl}`}
                      type="button"
                      onClick={() => setFatigue(lvl)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        fatigue === lvl
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
                      }`}
                    >
                      <div className="font-bold">{lvl}</div>
                      <div className={`text-[9px] truncate ${fatigue === lvl ? 'text-slate-300' : 'text-slate-500'}`}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duty & Shift Context */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label htmlFor="input-duty-hours" className="block text-xs font-semibold text-slate-700 mb-1">
                    Shift Duration (Hours)
                  </label>
                  <input
                    id="input-duty-hours"
                    type="number"
                    min="0"
                    max="24"
                    value={dutyHours}
                    onChange={(e) => setDutyHours(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border border-stone-200 bg-stone-50/60 p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input
                      id="input-night-shift"
                      type="checkbox"
                      checked={nightShift}
                      onChange={(e) => setNightShift(e.target.checked)}
                      className="rounded border-stone-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-700">Night Watch Shift</span>
                  </label>
                </div>
              </div>

              {/* Direct Confidential Officer Consultation Request */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    id="input-support-request"
                    type="checkbox"
                    checked={supportRequested}
                    onChange={(e) => setSupportRequested(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 h-4 w-4 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Request Direct Welfare Officer Consultation
                    </span>
                    <span className="text-[11px] text-amber-900/80 leading-relaxed block mt-0.5">
                      Subedar Arjun Kumar will contact you privately for support. Protected by Section 14 medical privilege.
                    </span>
                  </div>
                </label>
              </div>

              {/* Optional Confidential Notes */}
              <div>
                <label htmlFor="input-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  Confidential Officer Notes (Optional)
                </label>
                <textarea
                  id="input-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record relevant context: heavy weather, difficulty sleeping, family matters..."
                  className="w-full text-xs rounded-xl border border-stone-200 bg-stone-50/60 p-2.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <button
                id="btn-submit-checkin"
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Recording Log Entry...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 text-orange-400" />
                    <span>Record Daily Health Log</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Assessment Details & Progression Trends */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Assessment Card */}
          {latestAssessment ? (
            <div id="assessment-summary-card" className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <Activity className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                      Validated Health Assessment ({latestAssessment.date})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Standardized Evaluation Protocol Rev {latestAssessment.algorithmVersion}
                    </p>
                  </div>
                </div>
                <StatusBadge type="band" value={latestAssessment.band} />
              </div>

              {/* Quantitative Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    Calculated Index
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
                    {latestAssessment.index}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Coverage: {Math.round(latestAssessment.coverage * 100)}% verified
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    Rest &amp; Sleep Score
                  </span>
                  <div className="text-3xl font-bold text-slate-800 font-mono mt-1">
                    {latestAssessment.contributors.sleepScore}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {latestAssessment.contributors.sleepDeltaFromBaseline !== undefined
                      ? `${latestAssessment.contributors.sleepDeltaFromBaseline > 0 ? '+' : ''}${latestAssessment.contributors.sleepDeltaFromBaseline}h vs baseline`
                      : 'Baseline verified'}
                  </span>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    Fatigue Load
                  </span>
                  <div className="text-3xl font-bold text-slate-800 font-mono mt-1">
                    {Math.round((latestAssessment.contributors.stressScore + latestAssessment.contributors.fatigueScore) / 2)}
                    <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Self-reported aggregate
                  </span>
                </div>
              </div>

              {/* Transparent Factor Breakdown */}
              <div className="space-y-2 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                <span className="text-[11px] font-bold text-slate-700 block tracking-wide uppercase">
                  Contributor Breakdown &amp; Explanations:
                </span>
                <div className="space-y-1.5">
                  {latestAssessment.contributors.explanations.map((exp, idx) => (
                    <div key={idx} className="flex items-start text-xs text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 mr-2 shrink-0" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Fatigue & Strain Horizon */}
              {latestAssessment.forecastValue !== undefined && (
                <div
                  id="forecast-provenance-box"
                  className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-semibold text-slate-200">
                        Operational Fatigue Horizon (Next Shift Projection)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-orange-300 border border-slate-700">
                      Model v{latestAssessment.modelVersion}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Projected Shift Strain</span>
                      <span className="text-lg font-bold font-mono text-orange-300">
                        {latestAssessment.forecastValue.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Rolling Baseline</span>
                      <span className="text-lg font-bold font-mono text-slate-300">
                        {latestAssessment.forecastBaseline?.toFixed(1) ?? '3.0'} / 5.0
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Based on shift duty load, consecutive night rotations, and sleep deficit differentials. Strictly advisory; not a clinical psychiatric diagnosis.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-slate-400 text-xs">
              No check-in recorded for current session. Submit today&apos;s log to view formulation.
            </div>
          )}

          {/* 7-Day Personal Trend Chart */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  7-Day Longitudinal Health Progression
                </h3>
                <p className="text-xs text-slate-500">Monitoring strain index against Review Threshold (65)</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center text-orange-700 font-medium">
                  <span className="w-2.5 h-1 bg-orange-500 rounded-full mr-1.5" />
                  Index (0–100)
                </span>
                <span className="flex items-center text-rose-600 font-medium">
                  <span className="w-2.5 h-0.5 bg-rose-500 border-dashed mr-1.5" />
                  Review (65)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickFormatter={(val) => val.replace('2026-09-', 'Sep ')}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#f8fafc',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                      formatter={(val: any) => [`${val}/100`, 'Health Index']}
                    />
                    <ReferenceLine
                      y={65}
                      stroke="#e11d48"
                      strokeDasharray="4 4"
                      label={{ value: 'Review Threshold (65)', position: 'top', fill: '#e11d48', fontSize: 10 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="index"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#f97316', strokeWidth: 1, stroke: '#ffffff' }}
                      activeDot={{ r: 6, fill: '#ea580c' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading progression records...
                </div>
              )}
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>Verified Baseline Rest: <strong className="text-slate-800">7.2 hrs</strong></span>
              <span>Consecutive Alert Criterion: <strong className="text-slate-800">2 consecutive days $\ge 65$ initiates Welfare Case</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
