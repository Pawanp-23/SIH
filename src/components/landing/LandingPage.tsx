import React, { useState } from 'react';
import { UserRole } from '../../types.js';
import {
  Shield,
  Heart,
  Wind,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Moon,
  Zap,
  TrendingUp,
  FileText,
  BookOpen,
  Calendar,
  HelpCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { SignUpModal } from './SignUpModal.js';
import { TacticalResetModal } from '../common/TacticalResetModal.js';
import { WhoMethodologyModal } from '../common/WhoMethodologyModal.js';

interface LandingPageProps {
  onEnterDashboard: (role?: UserRole, userId?: string) => void;
  onOpenTacticalReset: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenTacticalReset
}) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  // Interactive Workflow Walkthrough Active Tab (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Interactive Mini-Demo State for Step 1
  const [simSleep, setSimSleep] = useState<number>(5.5);
  const [simFatigue, setSimFatigue] = useState<number>(3);
  const [simDutyHours, setSimDutyHours] = useState<number>(10);

  // Calculated live strain index for interactive demo
  const calculatedStrain = Math.min(
    100,
    Math.max(
      15,
      Math.round(
        (8.0 - simSleep) * 12 +
        simFatigue * 14 +
        (simDutyHours > 8 ? (simDutyHours - 8) * 4 : 0)
      )
    )
  );

  const getStrainBand = (val: number) => {
    if (val >= 65) return { band: 'Review', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (val >= 40) return { band: 'Watch', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { band: 'Routine', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const currentBand = getStrainBand(calculatedStrain);

  const handleSignUpSuccess = (userId: string, role: UserRole) => {
    onEnterDashboard(role, userId);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSuccess={handleSignUpSuccess}
      />

      {/* Breathing Reset Modal */}
      <TacticalResetModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* WHO Methodology Modal */}
      <WhoMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Top Calm Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/70 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 shadow-xs">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-serif">SAHARA</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-100 text-slate-600 border border-stone-200">
                  AI Welfare
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Armed Forces Health &amp; Operational Readiness System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsBreathingOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <Wind className="w-3.5 h-3.5 text-orange-600" />
              <span>1-Min Breathing</span>
            </button>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-stone-200 rounded-full transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>WHO Standards</span>
            </button>

            <button
              id="btn-landing-explore"
              onClick={() => onEnterDashboard()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-all cursor-pointer"
            >
              Quick Demo View
            </button>

            <button
              id="btn-landing-signup"
              onClick={() => setIsSignUpOpen(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Sign Up &amp; Enter</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Calm, Reassuring, Clear */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Section 14 Statutory Medical Privilege &bull; Zero Retaliatory Logging</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-serif">
            Peace of mind for the soldier. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700">
              Clarity for the commander.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SAHARA transforms defense welfare through compassionate, explainable AI. Soldiers log confidential 30-second recovery reflections, welfare officers receive early non-punitive care alerts, and leadership gains aggregated readiness metrics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              id="btn-hero-signup"
              onClick={() => setIsSignUpOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Get Started &amp; Choose Your Role</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>

            <button
              onClick={() => onEnterDashboard('personnel', 'p-014')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-slate-800 font-semibold text-sm border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              Enter as Service Member (Rajesh)
            </button>
          </div>

          {/* Core Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-stone-200/80 text-left">
            <div className="p-3 bg-white/80 rounded-2xl border border-stone-200/70 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-slate-900">Medical Privilege</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Section 14 Protected</div>
            </div>

            <div className="p-3 bg-white/80 rounded-2xl border border-stone-200/70 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center mb-1.5">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-slate-900">k ≥ 10 Anonymity</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero individual snooping</div>
            </div>

            <div className="p-3 bg-white/80 rounded-2xl border border-stone-200/70 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-slate-900">TreeSHAP AI</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% Explainable factors</div>
            </div>

            <div className="p-3 bg-white/80 rounded-2xl border border-stone-200/70 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1.5">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-slate-900">Non-Punitive Care</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Focus on recovery &amp; rest</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Explainer (Demystifying the entire system!) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Interactive Workflow Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How the SAHARA Ecosystem Works
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step through the 4-phase non-punitive loop. Click each step to see what happens and test the live interactive preview.
            </p>
          </div>

          {/* 4 Step Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              {
                num: 1,
                title: 'Daily Reflection',
                sub: 'Service Member Check-in',
                icon: Heart
              },
              {
                num: 2,
                title: 'Explainable AI',
                sub: 'TreeSHAP Factor Breakdown',
                icon: Sparkles
              },
              {
                num: 3,
                title: 'Supportive Care',
                sub: 'Welfare Officer Triage',
                icon: Activity
              },
              {
                num: 4,
                title: 'Force Readiness',
                sub: 'Anonymized Command View',
                icon: Layers
              }
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                      : 'bg-[#FAF8F5] hover:bg-stone-100 text-slate-700 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-stone-200 text-slate-700'
                      }`}
                    >
                      {step.num}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs">{step.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {step.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Step Detail Card */}
          <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phase 1: Confidential Individual Reflection</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Service Member Logs 3 Simple Metrics in 30 Seconds
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every morning, personnel log three basic health indicators: hours of sleep, perceived physical fatigue, and stress. Individual records are sealed under Section 14 medical confidentiality: commanders cannot inspect raw personal inputs.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>Zero disciplinary consequences or performance penalty</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>Instant personal recovery recommendations (e.g. 90-min sleep cycle)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>Option to request confidential officer consultation with one click</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('personnel', 'p-014')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Try the Service Member Check-In Screen</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </div>
                </div>

                {/* Interactive Live Mini-Simulator */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-orange-500" />
                      <span>Live Interactive Check-In Demo</span>
                    </span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentBand.color}`}>
                      Strain: {calculatedStrain}/100 ({currentBand.band})
                    </span>
                  </div>

                  {/* Sleep Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-slate-400" />
                        Hours Slept Last Night:
                      </span>
                      <span className="font-mono font-bold text-orange-700">{simSleep.toFixed(1)} hrs</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      step="0.5"
                      value={simSleep}
                      onChange={(e) => setSimSleep(parseFloat(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer h-2 bg-stone-100 rounded-lg"
                    />
                  </div>

                  {/* Fatigue Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-slate-400" />
                        Perceived Fatigue Level (1–5):
                      </span>
                      <span className="font-mono font-bold text-slate-900">{simFatigue} / 5</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSimFatigue(lvl)}
                          className={`py-1.5 rounded-xl border text-xs font-medium transition-all ${
                            simFatigue === lvl
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-[11px] text-slate-600 leading-relaxed">
                    <strong>Real-Time Result:</strong> {simSleep < 6 ? 'Sleep deficit detected (-2.2h vs optimal baseline). Recommend restorative blackout nap.' : 'Sleep duration within healthy operational tolerance.'}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Phase 2: Mathematical Factor Attribution</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Zero Black-Box Mystery: TreeSHAP Explains Every Single Point
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Legacy AI assigns arbitrary risk flags without explanation. SAHARA employs TreeSHAP (Tree Shapley Additive Explanations) so welfare officers see mathematically verified contributors: exactly how much sleep debt, shift duration, or night duty influenced the score.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Additive equation: Strain = Base (28.4) + Factor Contributions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Transparent justification before initiating any welfare consultation</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('command_viewer')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Explore TreeSHAP in Personnel Deep-Dive</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </div>
                </div>

                {/* Factor Contribution Visual Card */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 space-y-3.5 shadow-sm">
                  <span className="text-xs font-bold text-slate-900 block border-b border-stone-100 pb-2">
                    Sample TreeSHAP Factor Waterfall
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-rose-700">+ Acute Sleep Deficit (4.5h vs 7.2h baseline)</span>
                        <span className="font-mono font-bold text-rose-700">+22.4 pts</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full w-[70%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-rose-700">+ Night Duty Rotation (3 consecutive shifts)</span>
                        <span className="font-mono font-bold text-rose-700">+14.1 pts</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[45%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-emerald-700">- High Squad Cohesion &amp; Rest Days</span>
                        <span className="font-mono font-bold text-emerald-700">-8.5 pts</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[25%]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-[11px] text-slate-500">
                    Net Strain Score = <strong className="text-slate-900 font-mono">68/100 (Review Band)</strong> &bull; Fully auditable by medical officers.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phase 3: Proactive Care, Never Punishment</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Assigned Welfare Officers Receive Early Support Alerts
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    When consecutive fatigue entries exceed safe operational limits (Index ≥ 65 for 2 days), the designated Unit Welfare Officer (e.g. Subedar Arjun Kumar) receives a confidential case notice to schedule rest rotations, hydration checks, and quiet recovery.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>Standardized Standard Operating Procedures (SOP-WEL-01 to 05)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>What-If Simulator tests rotation impacts before altering duty rosters</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('welfare_officer', 'wo-kumar')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Login as Subedar Arjun Kumar (Welfare Officer)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Welfare Triage Alert #CASE-882</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Service Member:</strong> Rajesh Verma (Constable, 102nd Mountain Bn)
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Recommended SOP:</strong> 72-Hour Circadian Blackout Sleep &bull; Reassign Night Watch Duty
                  </p>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                    <strong>Resolution Status:</strong> Non-punitive check-in scheduled for 14:00 today.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>Phase 4: High-Level Force Readiness</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Brigade Commanders See Battalion Health Without Surveillance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Sector commanders require macro-level awareness of combat readiness, not micromanagement of individuals. Cohorts with fewer than 10 personnel are automatically masked by cryptographic k-anonymity suppression to preserve absolute trust.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>Force readiness percentage benchmarked against WHO GDHM standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>One-click Sector Executive Intelligence Brief for brigade meetings</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('command_viewer', 'cmd-singh')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Login as Col. Harpreet Singh (Command View)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-slate-900 block border-b border-stone-100 pb-2">
                    Force Health Matrix (Sector CommandHQ)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="text-[10px] text-slate-500 uppercase">Force Readiness</div>
                      <div className="text-xl font-black text-slate-900 font-mono mt-0.5">88.4%</div>
                      <div className="text-[10px] text-emerald-600 font-medium">WHO Benchmark Met</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="text-[10px] text-slate-500 uppercase">Avg Night Rota</div>
                      <div className="text-xl font-black text-slate-900 font-mono mt-0.5">28.5%</div>
                      <div className="text-[10px] text-slate-500">Under 35% Cap</div>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                    <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
                    <strong>Detachment Alpha (6 personnel):</strong> Data automatically suppressed per Section 14 (cohort size &lt; 10).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Core Roles Section with Instant Sign Up & Direct Access */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Tailored Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Choose Your Operating Persona
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Switch between roles at any time using the clearance selector in the top bar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Member Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-stone-300 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Service Member</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log daily sleep, physical fatigue, and stress in a supportive, private space. Access 1-minute tactical breathing resets and recovery rituals.
              </p>
              <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-slate-500">
                <div>&bull; Protected by Section 14 Medical Privilege</div>
                <div>&bull; 7-Day longitudinal wellness progression</div>
                <div>&bull; Confidential officer consultation button</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onEnterDashboard('personnel', 'p-014')}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enter as Service Member</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>

          {/* Welfare Officer Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-stone-300 transition-all shadow-sm ring-2 ring-orange-500/20">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Welfare Officer</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  Care Wing
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Triage personnel alerts, review TreeSHAP factor explanations, simulate roster rebalancings, and assign supportive recovery workflows.
              </p>
              <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-slate-500">
                <div>&bull; Non-punitive intervention triage</div>
                <div>&bull; What-If rotation schedule simulator</div>
                <div>&bull; Clinical SOP guidance engine</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onEnterDashboard('welfare_officer', 'wo-kumar')}
                className="w-full py-2.5 px-4 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Enter as Welfare Officer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Brigade Commander Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-stone-300 transition-all shadow-sm">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Brigade Commander</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategic oversight across active battalions, sector outposts, and strike regiments. Review circadian load and readiness velocity.
              </p>
              <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-slate-500">
                <div>&bull; 4 WHO GDHM Strategic Health Pillars</div>
                <div>&bull; Cryptographic k ≥ 10 privacy suppression</div>
                <div>&bull; Printable Executive Intelligence Brief</div>
              </div>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onEnterDashboard('command_viewer', 'cmd-singh')}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enter as Commander</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reassuring Calm Banner Before Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="w-12 h-12 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-orange-400">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Ready to experience dignified defense wellness?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Create your personalized profile or jump into any role directly to explore the 7-screen intelligence suite.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Sign Up &amp; Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBreathingOpen(true)}
              className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Wind className="w-3.5 h-3.5 text-orange-400" />
              <span>Try 1-Min Guided Breathing First</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-center text-xs">
        <p>
          SAHARA AI Welfare Intelligence System &bull; Armed Forces Health &amp; Welfare Directorate &bull; Compliant with Section 14 Privacy Directives &bull; WHO Global Digital Health Reporting Standards
        </p>
      </footer>
    </div>
  );
};
