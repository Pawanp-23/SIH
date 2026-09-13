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
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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
  ShieldCheck,
  ClipboardList,
  Compass,
  MessageSquare,
  Video,
  BookOpen,
  FileText,
  Trash2,
  Download,
  Sliders
} from 'lucide-react';
import { TacticalResetModal } from '../common/TacticalResetModal.js';
import { MentalHealthChatbot } from './MentalHealthChatbot.js';
import { CommunityStoryWall } from './CommunityStoryWall.js';
import { CounsellingVideoRoom } from './CounsellingVideoRoom.js';

interface PersonnelDashboardProps {
  user: UserProfile;
  onRefreshUser: () => void;
  initialSubTab?: 'checkin' | 'wellbeing' | 'assessment' | 'recovery' | 'assistance' | 'privacy';
}

export const PersonnelDashboard: React.FC<PersonnelDashboardProps> = ({
  user,
  onRefreshUser,
  initialSubTab = 'checkin'
}) => {
  const [activeTab, setActiveTab] = useState<
    'checkin' | 'wellbeing' | 'assessment' | 'recovery' | 'assistance' | 'privacy'
  >(initialSubTab);

  const [assistanceSubTab, setAssistanceSubTab] = useState<'chatbot' | 'stories' | 'video'>('chatbot');

  const [trends, setTrends] = useState<any[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTacticalResetOpen, setIsTacticalResetOpen] = useState(false);

  // Form State for Daily Checkin
  const [formDate, setFormDate] = useState('2026-09-12');
  const [sleepHours, setSleepHours] = useState<number>(5.5);
  const [stress, setStress] = useState<number>(3);
  const [fatigue, setFatigue] = useState<number>(3);
  const [dutyHours, setDutyHours] = useState<number>(10);
  const [nightShift, setNightShift] = useState<boolean>(false);
  const [supportRequested, setSupportRequested] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  // Assessment State (PHQ-9 / GAD-7 military screening)
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([1, 2, 1, 0, 1, 2, 1]);
  const [screeningResult, setScreeningResult] = useState<{
    score: number;
    band: string;
    action: string;
  } | null>(null);

  // Privacy controls state
  const [purgeRequested, setPurgeRequested] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

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
        setSubmitMessage(`Health log registered. Score: ${res.assessment.index}/100 (${res.assessment.band.toUpperCase()})`);
        setLatestAssessment(res.assessment);
        loadTrends();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Log submission failed. Please verify entries.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCalculateScreening = () => {
    const total = assessmentAnswers.reduce((acc, curr) => acc + curr, 0);
    let band = 'Low Fatigue / Routine';
    let action = 'Maintain current restorative sleep routines and hydration pacing.';

    if (total >= 14) {
      band = 'Elevated Tactical Strain';
      action = 'Recommend 48-hour duty shift reduction and confidential session with Medical Officer.';
    } else if (total >= 8) {
      band = 'Moderate Operational Fatigue';
      action = 'Engage in 1-Minute Tactical Box Breathing and utilize anonymous peer decompression.';
    }

    setScreeningResult({ score: total, band, action });
  };

  // Radar Data for My Wellbeing
  const radarData = [
    { subject: 'Circadian Sleep', A: 68, fullMark: 100 },
    { subject: 'Vagal Recovery', A: 72, fullMark: 100 },
    { subject: 'Shift Pacing', A: 55, fullMark: 100 },
    { subject: 'Nutritional Index', A: 85, fullMark: 100 },
    { subject: 'Stress Immunity', A: 62, fullMark: 100 },
    { subject: 'Peer Camaraderie', A: 90, fullMark: 100 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-[#1E1E1E]">
      {/* Tactical Breathing Modal */}
      <TacticalResetModal
        isOpen={isTacticalResetOpen}
        onClose={() => setIsTacticalResetOpen(false)}
      />

      {/* Top Welcome & Medical Privilege Banner */}
      <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1d9f76]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1d9f76]/15 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] shrink-0 mt-0.5 shadow-xs">
              <Heart className="w-5 h-5 text-[#0f7058]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-[#1E1E1E] tracking-tight font-serif">
                  01 Personnel Portal &bull; {user.alias}
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono bg-[#E3DDCF] text-[#1E1E1E] border border-[#D2CBBB]">
                  {user.unit || '102nd Mountain Battalion'}
                </span>
                <span className="inline-flex items-center text-[11px] text-[#0f7058] font-bold bg-[#1d9f76]/15 px-2.5 py-0.5 rounded-full border border-[#1d9f76]/30">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#1d9f76]" />
                  Section 14 Medical Privilege Active
                </span>
              </div>
              <p className="text-xs text-[#5E5A52] mt-1 leading-relaxed max-w-2xl">
                Confidential service member health enclave. Your personal inputs are never visible to commanding officers — command only receives aggregate cohort health summaries ($k \ge 10$).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            <button
              onClick={() => setIsTacticalResetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-[#efa02a] hover:bg-[#efa02a]/90 text-[#1E1E1E] shadow-2xs transition-all cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5 text-[#1E1E1E]" />
              <span>1-Min Reset</span>
            </button>

            <button
              id="btn-toggle-consent"
              onClick={handleToggleConsent}
              className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                user.hasConsented
                  ? 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                  : 'bg-[#1d9f76] hover:bg-[#0f7058] text-white border-[#1d9f76] shadow-xs'
              }`}
            >
              {user.hasConsented ? 'Consent Active' : 'Enable Support'}
            </button>
          </div>
        </div>
      </div>

      {/* 6 Exact Sub-Sections Tabs Header */}
      <div className="bg-[#E3DDCF] p-1.5 rounded-2xl border border-[#D2CBBB] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'checkin'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Wellness check-in</span>
        </button>

        <button
          onClick={() => setActiveTab('wellbeing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'wellbeing'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>My wellbeing</span>
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'assessment'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Assessment</span>
        </button>

        <button
          onClick={() => setActiveTab('recovery')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'recovery'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Recovery recommendations</span>
        </button>

        <button
          onClick={() => setActiveTab('assistance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'assistance'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Confidential assistance</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy controls</span>
        </button>
      </div>

      {/* SUB-SECTION 1: WELLNESS CHECK-IN */}
      {activeTab === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Input Form */}
          <div className="lg:col-span-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
              <div>
                <h3 className="font-bold text-[#1E1E1E] text-base tracking-tight font-serif flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#1d9f76]" />
                  Daily Wellbeing Check-In
                </h3>
                <p className="text-xs text-[#5E5A52] mt-0.5">Quick confidential morning reflection</p>
              </div>
              <span className="text-xs font-mono font-medium text-[#1E1E1E] bg-[#E3DDCF] border border-[#D2CBBB] px-2.5 py-1 rounded-full">
                {formDate}
              </span>
            </div>

            {submitMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2.5 shrink-0 text-emerald-600" />
                <span>{submitMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2.5 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs rounded-xl border-[#D2CBBB] bg-[#E3DDCF] p-2.5 border text-[#1E1E1E] focus:bg-[#F4EFE4] focus:ring-1 focus:ring-[#1d9f76] focus:outline-none"
                  required
                />
              </div>

              {/* Sleep Hours Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#1E1E1E] flex items-center">
                    <Moon className="w-3.5 h-3.5 mr-1.5 text-[#5E5A52]" />
                    Sleep Duration (Past 24 Hours)
                  </label>
                  <span className="text-xs font-bold font-mono text-[#0f7058] bg-[#1d9f76]/15 px-2.5 py-0.5 rounded-full border border-[#1d9f76]/30">
                    {sleepHours.toFixed(1)} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#D2CBBB] rounded-lg appearance-none cursor-pointer accent-[#1d9f76]"
                />
              </div>

              {/* Perceived Stress (1-5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#1E1E1E] flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-[#5E5A52]" />
                    Perceived Stress Level
                  </label>
                  <span className="text-xs font-bold font-mono text-[#1E1E1E] bg-[#E3DDCF] px-2 py-0.5 rounded-full border border-[#D2CBBB]">
                    {stress} / 5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStress(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        stress === lvl
                          ? 'bg-[#1d9f76] text-white border-[#1d9f76] shadow-2xs'
                          : 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceived Fatigue (1-5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#1E1E1E] flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-[#5E5A52]" />
                    Physical Fatigue
                  </label>
                  <span className="text-xs font-bold font-mono text-[#1E1E1E] bg-[#E3DDCF] px-2 py-0.5 rounded-full border border-[#D2CBBB]">
                    {fatigue} / 5
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFatigue(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        fatigue === lvl
                          ? 'bg-[#efa02a] text-[#1E1E1E] border-[#efa02a] shadow-2xs'
                          : 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duty Hours & Night Shift */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Shift Duration
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={dutyHours}
                    onChange={(e) => setDutyHours(parseInt(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border-[#D2CBBB] bg-[#E3DDCF] p-2 border text-[#1E1E1E]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs text-[#1E1E1E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nightShift}
                      onChange={(e) => setNightShift(e.target.checked)}
                      className="rounded border-[#D2CBBB] text-[#1d9f76] focus:ring-[#1d9f76] h-4 w-4"
                    />
                    <span>Night Shift Sentry</span>
                  </label>
                </div>
              </div>

              {/* Confidential Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                  Confidential Personal Note (Encrypted)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record symptoms, high altitude cold sensations, or patrol debrief notes..."
                  className="w-full text-xs rounded-xl border-[#D2CBBB] bg-[#E3DDCF] p-2 border text-[#1E1E1E]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {submitting ? 'Registering...' : 'Submit Confidential Reflection'}
              </button>
            </form>
          </div>

          {/* Right: Latest Calculation & Formulation */}
          <div className="lg:col-span-6 space-y-4">
            {latestAssessment ? (
              <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
                  <div>
                    <h4 className="font-bold text-base font-serif text-[#1E1E1E]">
                      Current Wellbeing Formulation
                    </h4>
                    <p className="text-xs text-[#5E5A52]">Calculated: {latestAssessment.date}</p>
                  </div>
                  <StatusBadge band={latestAssessment.band} size="lg" />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
                  <div>
                    <span className="text-xs text-[#5E5A52] block">Composite Strain Index</span>
                    <span className="text-3xl font-extrabold font-serif text-[#1E1E1E]">
                      {latestAssessment.index}
                      <span className="text-sm font-normal text-[#5E5A52]"> / 100</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#5E5A52] block">Status</span>
                    <span className="text-xs font-bold font-mono text-[#0f7058] uppercase">
                      {latestAssessment.band} Review
                    </span>
                  </div>
                </div>

                {/* Plain-English Contributor Explanations */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#1E1E1E] block">
                    Key Influencing Factors:
                  </span>
                  <div className="space-y-1.5">
                    {latestAssessment.contributors.explanations.map((exp, idx) => (
                      <div key={idx} className="flex items-start text-xs text-[#5E5A52] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76] mt-1.5 mr-2 shrink-0" />
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactical Actions */}
                <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] flex items-center justify-between">
                  <span className="text-xs text-[#1E1E1E] font-medium">Need immediate grounding?</span>
                  <button
                    onClick={() => setIsTacticalResetOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    1-Min Box Breathing
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] text-[#5E5A52] text-xs">
                No check-in recorded for current session. Submit today&apos;s log to view formulation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: MY WELLBEING */}
      {activeTab === 'wellbeing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7-Day Trend Line Chart */}
            <div className="lg:col-span-7 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
                <div>
                  <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                    7-Day Longitudinal Health Progression
                  </h3>
                  <p className="text-xs text-[#5E5A52]">Monitoring strain index against Review Threshold (65)</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center text-[#0f7058] font-bold">
                    <span className="w-2.5 h-1 bg-[#1d9f76] rounded-full mr-1.5" />
                    Index (0–100)
                  </span>
                  <span className="flex items-center text-rose-600 font-bold">
                    <span className="w-2.5 h-0.5 bg-rose-500 border-dashed mr-1.5" />
                    Review (65)
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                {trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#5E5A52' }}
                        tickFormatter={(val) => val.replace('2026-09-', 'Sep ')}
                        axisLine={{ stroke: '#D2CBBB' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#5E5A52' }}
                        axisLine={{ stroke: '#D2CBBB' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1E',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#F4EFE4',
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
                        stroke="#1d9f76"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#1d9f76', strokeWidth: 1, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#0f7058' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#5E5A52]">
                    Loading progression records...
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-[11px] text-[#5E5A52] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>Verified Baseline Rest: <strong className="text-[#1E1E1E]">7.2 hrs</strong></span>
                <span>Consecutive Alert Criterion: <strong className="text-[#1E1E1E]">2 consecutive days &ge; 65 initiates Welfare Case</strong></span>
              </div>
            </div>

            {/* Radar of Circadian & Physiological Balance */}
            <div className="lg:col-span-5 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-3">
              <div className="border-b border-[#D2CBBB] pb-3">
                <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                  Holistic Readiness Radar
                </h3>
                <p className="text-xs text-[#5E5A52]">Multi-domain health equilibrium</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={80} data={radarData}>
                    <PolarGrid stroke="#D2CBBB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#1E1E1E' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Readiness"
                      dataKey="A"
                      stroke="#1d9f76"
                      fill="#1d9f76"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-[#5E5A52] p-2.5 bg-[#E3DDCF] rounded-xl border border-[#D2CBBB]">
                Strongest: <strong className="text-[#0f7058]">Peer Camaraderie (90%)</strong> &bull; Lowest: <strong className="text-amber-800">Shift Pacing (55%)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: ASSESSMENT (PHQ-9 / GAD-7 Standardized Screening) */}
      {activeTab === 'assessment' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Standardized Clinical Health Screening (PHQ-9 &amp; GAD-7 Adaptation)
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Validated military psychological assessment for operational strain and combat recovery.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
              Self-Administered
            </span>
          </div>

          <div className="space-y-4">
            {[
              'Little interest or pleasure in daily unit activities or leisure routines',
              'Feeling down, depressed, detached, or hopeless while off-duty',
              'Trouble falling asleep, staying asleep, or sleeping excessively after shifts',
              'Feeling tired, drained, or having diminished physical stamina',
              'Feeling nervous, anxious, hyper-vigilant, or on edge during patrols',
              'Not being able to stop or control worrying thoughts regarding family or safety',
              'Difficulty concentrating on briefing instructions or technical checklists'
            ].map((question, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#E3DDCF] border border-[#D2CBBB] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="text-xs font-medium text-[#1E1E1E] max-w-xl">
                  <span className="font-mono text-[#0f7058] font-bold mr-2">0{idx + 1}.</span>
                  {question}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {['Not at all (0)', 'Several days (1)', 'More than half (2)', 'Nearly every day (3)'].map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        const newAns = [...assessmentAnswers];
                        newAns[idx] = optIdx;
                        setAssessmentAnswers(newAns);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        assessmentAnswers[idx] === optIdx
                          ? 'bg-[#1d9f76] text-white border-[#1d9f76] font-bold'
                          : 'bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] border-[#D2CBBB]'
                      }`}
                    >
                      {optIdx}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleCalculateScreening}
              className="px-6 py-2.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Calculate Standardized Score
            </button>

            {screeningResult && (
              <div className="p-3.5 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E1E1E]">Total Score: {screeningResult.score} / 21</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                    {screeningResult.band}
                  </span>
                </div>
                <p className="text-[#5E5A52] text-[11px]">{screeningResult.action}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: RECOVERY RECOMMENDATIONS */}
      {activeTab === 'recovery' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Doctor-Approved SOP 4.2 Recovery Recommendations
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Evidence-based medical protocols to resolve circadian desynchrony and autonomic fatigue.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
              Clinical SOP 4.2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protocol 1: 48-Hour Sleep Reset */}
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1d9f76]/20 text-[#0f7058] flex items-center justify-center font-bold text-xs">
                <Moon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#1E1E1E]">48-Hour Sleep Debt Reset</h4>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Block light with eye protection 90 minutes post-shift. Consume magnesium-rich electrolyte hydration and avoid blue light screens.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#0f7058] font-semibold">
                &bull; Reduces reaction lag by 41%
              </div>
            </div>

            {/* Protocol 2: Box Breathing */}
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#efa02a]/20 text-amber-900 flex items-center justify-center font-bold text-xs">
                <Wind className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#1E1E1E]">Box Breathing (4-4-4-4)</h4>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                4-count inhale, 4-count hold, 4-count exhale, 4-count pause. Activates parasympathetic brake to reduce cortisol and tremors.
              </p>
              <button
                onClick={() => setIsTacticalResetOpen(true)}
                className="text-xs font-bold text-[#1d9f76] hover:underline"
              >
                Launch Interactive Ritual &rarr;
              </button>
            </div>

            {/* Protocol 3: High-Altitude Hydration */}
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-800 flex items-center justify-center font-bold text-xs">
                <Heart className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#1E1E1E]">Extreme Cold &amp; Altitude Pacing</h4>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                At &gt;12,000 ft, respiratory water loss increases by 2.4x. Maintain warm fluid intake every 2 hours and coordinate buddy checks for hypoxia.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#0f7058] font-semibold">
                &bull; Medical Corps Standard
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: CONFIDENTIAL ASSISTANCE */}
      {activeTab === 'assistance' && (
        <div className="space-y-4">
          {/* Sub-nav switcher for assistance modes */}
          <div className="flex items-center justify-between bg-[#E3DDCF] p-2 rounded-2xl border border-[#D2CBBB]">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAssistanceSubTab('chatbot')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  assistanceSubTab === 'chatbot'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Mental Health Chatbot (Voice + Text)</span>
              </button>

              <button
                onClick={() => setAssistanceSubTab('stories')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  assistanceSubTab === 'stories'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Anonymous Community Story Wall</span>
              </button>

              <button
                onClick={() => setAssistanceSubTab('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  assistanceSubTab === 'video'
                    ? 'bg-[#1d9f76] text-white shadow-xs'
                    : 'text-[#5E5A52] hover:text-[#1E1E1E]'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Secure Counselling &amp; Video Sessions</span>
              </button>
            </div>
          </div>

          {assistanceSubTab === 'chatbot' && (
            <MentalHealthChatbot
              onOpenTacticalReset={() => setIsTacticalResetOpen(true)}
              onOpenVideoCounselling={() => setAssistanceSubTab('video')}
              onOpenStoryWall={() => setAssistanceSubTab('stories')}
              onOpenPrivacy={() => setActiveTab('privacy')}
            />
          )}

          {assistanceSubTab === 'stories' && <CommunityStoryWall />}

          {assistanceSubTab === 'video' && (
            <CounsellingVideoRoom onOpenTacticalReset={() => setIsTacticalResetOpen(true)} />
          )}
        </div>
      )}

      {/* SUB-SECTION 6: PRIVACY CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Statutory Privacy Controls &amp; Data Sovereign Rights
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Section 14 Armed Forces Health Secrecy &bull; Guaranteed non-punitive immunity
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
              Protected Enclave
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="text-sm font-bold text-[#1E1E1E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1d9f76]" />
                <span>Section 14 Immunity Certificate</span>
              </h4>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                By military regulation, health reflections, sleep tracking, and psychological counseling queries are classified as strictly privileged medical communications. They cannot be used in disciplinary proceedings or promotion evaluations.
              </p>
              <button
                onClick={() => alert('Section 14 Immunity Verification Token: AFMS-SEC14-PRIV-9824\nValid for all 2026 operational records.')}
                className="mt-2 text-xs font-bold text-[#0f7058] flex items-center gap-1 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Verified Legal Immunity Token</span>
              </button>
            </div>

            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="text-sm font-bold text-[#1E1E1E] flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Immediate Data Purge Option</span>
              </h4>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Under operational data sovereign policies, you have the right to request the complete, irreversible erasure of all personal check-in records from the local client and server cache.
              </p>
              <button
                onClick={() => {
                  setPurgeRequested(true);
                  alert('Data purge request recorded. Past check-in notes scrubbed from local cache.');
                }}
                className="mt-2 text-xs font-bold text-rose-700 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{purgeRequested ? 'Purge Requested & Verified' : 'Request Record Deletion'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
            <h4 className="text-sm font-bold text-[#1E1E1E]">Access Ledger &amp; Anonymity Verification</h4>
            <div className="text-xs text-[#5E5A52] space-y-1">
              <div>&bull; Commander Viewing Scope: <strong className="text-[#1E1E1E]">Battalion Aggregate Only ($k \ge 10$)</strong></div>
              <div>&bull; Raw Individual Stress Scores: <strong className="text-[#0f7058]">Redacted from Command Tier</strong></div>
              <div>&bull; Chatbot Conversations: <strong className="text-[#0f7058]">Zero Server Logs Stored</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
