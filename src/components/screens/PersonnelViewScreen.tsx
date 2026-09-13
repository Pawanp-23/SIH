import React, { useEffect, useState } from 'react';
import { PersonnelRiskProfile, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  UserCheck,
  ShieldAlert,
  Clock,
  Moon,
  Activity,
  ArrowRight,
  TrendingUp,
  Sliders,
  Stethoscope,
  Info,
  ChevronRight,
  Lock,
  Sparkles,
  Heart,
  Wind,
  Coffee,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface PersonnelViewScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
  selectedPersonnelId?: string;
  onOpenTacticalReset?: () => void;
}

export const PersonnelViewScreen: React.FC<PersonnelViewScreenProps> = ({
  onNavigateScreen,
  selectedPersonnelId = 'p-014',
  onOpenTacticalReset
}) => {
  const [personnelId, setPersonnelId] = useState<string>(selectedPersonnelId);
  const [profile, setProfile] = useState<PersonnelRiskProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'plain_story' | 'clinical_shap'>('plain_story');

  const loadProfile = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.getPersonnelRiskProfile(id);
      if (res.success) {
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile(personnelId);
  }, [personnelId]);

  const personas = [
    { id: 'p-014', token: 'TOKEN-E9F2A8', name: 'Rajesh Verma (Constable)', status: 'High Risk (78)', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'p-022', token: 'TOKEN-B31F90', name: 'Manoj Rao (Havildar)', status: 'Moderate (58)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'p-008', token: 'TOKEN-A4C719', name: 'Amit Sharma (Lance Naik)', status: 'Routine (28)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
  ];

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium">Evaluating TreeSHAP Explainability &amp; Temporal Trajectory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="screen-personnel-view">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700 border border-stone-200">
              SCREEN 03 &bull; PERSONNEL DOSSIER
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              Pseudonym: <strong className="text-slate-900">{profile.pseudonymToken}</strong>
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              Section 14 Protected
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welfare Risk Index &amp; Plain-English Factor Story
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Detects fatigue before operational breakdown. Transparent factor attribution shows exactly what is causing fatigue and what is protecting wellness.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-goto-simulator"
            onClick={() => onNavigateScreen('what_if_simulator')}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Interventions</span>
          </button>
          <button
            id="btn-goto-intervention"
            onClick={() => onNavigateScreen('intervention_assistant')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            <Stethoscope className="w-3.5 h-3.5 text-orange-400" />
            <span>Formulate Care Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cohort Personas Selector */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 min-w-max pl-1">Cohort Member:</span>
        {personas.map((p) => (
          <button
            key={p.id}
            id={`btn-persona-${p.id}`}
            onClick={() => setPersonnelId(p.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              personnelId === p.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
            }`}
          >
            <span className="font-mono text-[11px] opacity-75">{p.token}</span>
            <span className="font-semibold">{p.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${p.color}`}>
              {p.status}
            </span>
          </button>
        ))}
      </div>

      {/* Primary KPI & Temporal Evolution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
              <span>Welfare Strain Index</span>
              <span className="font-mono text-[10px] bg-stone-100 px-2 py-0.5 rounded text-slate-600">XGBoost v1.2</span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-slate-900 font-mono tracking-tight">
                {profile.welfareRiskIndex}
              </span>
              <span className="text-base font-semibold text-slate-400">/ 100</span>
            </div>

            <div className="text-xs text-slate-500 mt-2 font-mono">
              95% Confidence Band: [{profile.confidenceInterval[0]}, {profile.confidenceInterval[1]}]
            </div>

            {/* Plain English Meaning */}
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>What this score means:</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                {profile.welfareRiskIndex >= 70
                  ? 'High cumulative strain. Needs prompt rest & night rotation swap before operational exhaustion.'
                  : profile.welfareRiskIndex >= 50
                  ? 'Mild strain accumulating. Watch sleep schedule and ensure hydration & rest.'
                  : 'Rested and balanced. Standard duty schedule is sustainable.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono border ${
                profile.band === 'review'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : profile.band === 'watch'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {profile.band.toUpperCase()} BAND PROTOCOL ACTIVE
            </span>
          </div>
        </div>

        {/* Temporal Evolution (34 -> 46 -> 61 -> 78 Trajectory) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <h2 className="text-base font-bold text-slate-900">02 &bull; How Risk Evolved Over 4 Duty Rotations</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracks fatigue accumulation from baseline deployment to current peak
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                +44 pts in 6 days
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
              {profile.temporalTrajectory.map((step, idx) => (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    idx === profile.temporalTrajectory.length - 1
                      ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-400/20'
                      : 'border-stone-200 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-mono">
                    <span>Phase 0{step.step}</span>
                    <span className="font-bold text-slate-700">{step.date.slice(5)}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1">{step.label}</div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black font-mono text-slate-900">{step.riskScore}</span>
                    <span className="text-[10px] text-slate-400">pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-stone-200 text-[10px] font-mono text-slate-500 flex justify-between">
                    <span>Rest: {step.sleepHours}h</span>
                    <span>Duty: {step.dutyHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pattern: Progressive fatigue due to nocturnal schedule disruption.</span>
            <span className="font-semibold text-orange-700">Reversible in 48 hours</span>
          </div>
        </div>
      </div>

      {/* Headspace x WHO: TreeSHAP Plain-English vs Clinical View */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-full">
                03 &bull; EXPLAINABLE AI
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {viewMode === 'plain_story' ? 'Why is Risk Elevated? (Factor Story)' : 'TreeSHAP Mathematical Attribution'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact breakdown of factors increasing strain versus factors protecting wellness
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-200/80 shrink-0">
            <button
              onClick={() => setViewMode('plain_story')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'plain_story'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Plain-English Story
            </button>
            <button
              onClick={() => setViewMode('clinical_shap')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'clinical_shap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Clinical TreeSHAP Formula
            </button>
          </div>
        </div>

        {viewMode === 'plain_story' ? (
          /* Headspace-Style Plain English Story Cards */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strain Contributors */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Factors Adding Strain (+48.2 pts)
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-800">Actionable</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                      <span className="flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-rose-500" />
                        Acute Sleep Deficit (&lt;4.5h)
                      </span>
                      <span className="text-rose-700 font-mono">+18.5 pts</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Averaged only 4.2 hours of fragmented rest over past 72 hours due to irregular night calls.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        Consecutive Night Shifts (4x)
                      </span>
                      <span className="text-rose-700 font-mono">+14.2 pts</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Circadian rhythms disrupted by four straight dusk-to-dawn duties without daylight resets.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-rose-500" />
                        Duty Shift Overtime (14h)
                      </span>
                      <span className="text-rose-700 font-mono">+9.4 pts</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Stood post for 14 continuous hours in cold mountain conditions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Protective Factors & Recommended Ritual */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Factors Protecting Resilience (-5.8 pts)
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-800">Cushioning</span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-white/80 border border-emerald-200/60 shadow-2xs text-xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-600" />
                        Squad Buddy Cohesion &amp; Morale
                      </span>
                      <span className="text-emerald-700 font-mono">-5.8 pts</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Strong peer camaraderie and daily communication with Havildar Manoj buffer emotional stress.
                    </p>
                  </div>

                  {/* Headspace Curated Recovery Ritual */}
                  <div className="mt-4 pt-3 border-t border-emerald-200/60">
                    <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>Today&apos;s Recommended Recovery Ritual:</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-emerald-200/50">
                        <span className="flex items-center gap-2 text-slate-800">
                          <Moon className="w-3.5 h-3.5 text-teal-600" />
                          <span>Barracks Blackout Sleep (90m)</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">-12 pts impact</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-emerald-200/50">
                        <span className="flex items-center gap-2 text-slate-800">
                          <Wind className="w-3.5 h-3.5 text-orange-500" />
                          <span>1-Min Tactical Reset Breath</span>
                        </span>
                        {onOpenTacticalReset && (
                          <button
                            onClick={onOpenTacticalReset}
                            className="text-[10px] font-bold text-orange-700 hover:text-orange-900 underline cursor-pointer"
                          >
                            Start Now &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 pt-3 border-t border-emerald-200/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clinical estimate: 48h rest will drop risk from 78 down to 35.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* WHO Clinical TreeSHAP Waterfall Representation */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 bg-stone-50 p-3 rounded-2xl border border-stone-200 font-mono">
              <span>Population Baseline (&phi;<sub>0</sub>): <strong>{profile.shapBaseValue} pts</strong></span>
              <span>&rarr;</span>
              <span>Individual Output f(x): <strong className="text-rose-700">{profile.welfareRiskIndex} pts</strong></span>
            </div>

            <div className="space-y-3">
              {profile.shapFactors.map((factor, idx) => {
                const isPositive = factor.direction === 'increases_risk';
                const widthPercent = Math.min(100, (Math.abs(factor.impact) / 25) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{factor.name}</span>
                        <span className="text-slate-500 text-[11px] font-mono">({factor.value})</span>
                      </div>
                      <div className="font-mono font-bold text-xs">
                        {isPositive ? (
                          <span className="text-rose-700">+{factor.impact.toFixed(1)} pts</span>
                        ) : (
                          <span className="text-emerald-700">{factor.impact.toFixed(1)} pts</span>
                        )}
                      </div>
                    </div>

                    <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden flex">
                      {isPositive ? (
                        <div
                          style={{ width: `${widthPercent}%` }}
                          className="bg-rose-500 rounded-full transition-all"
                        />
                      ) : (
                        <div
                          style={{ width: `${widthPercent}%` }}
                          className="bg-emerald-500 rounded-full transition-all ml-auto"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clinical Synthesis Footer */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-amber-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">Automated Clinical Synthesis</div>
            <p className="leading-relaxed text-amber-900">
              Acute sleep shortfall (&lt;4.5 hours) combined with 4 consecutive night duties accounts for <strong>73%</strong> of the score elevation. Intervening on circadian recovery will yield the highest risk drop per hour of duty relief.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
