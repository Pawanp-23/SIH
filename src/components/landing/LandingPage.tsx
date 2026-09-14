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
  UserCheck,
  Stethoscope,
  Plus
} from 'lucide-react';
import { SignUpModal } from './SignUpModal.js';
import { TacticalResetModal } from '../common/TacticalResetModal.js';
import { WhoMethodologyModal } from '../common/WhoMethodologyModal.js';

interface LandingPageProps {
  onEnterDashboard: (role?: UserRole, userId?: string) => void;
  onOpenTacticalReset: () => void;
  onOpenLogin?: () => void;
  onOpenArchitecture?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenTacticalReset,
  onOpenLogin,
  onOpenArchitecture
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
    <div className="min-h-screen bg-[#e9e4d8] text-[#1E1E1E] flex flex-col font-sans selection:bg-[#efa02a]/30 selection:text-[#1E1E1E]">
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
      <header className="sticky top-0 z-30 bg-[#e9e4d8]/90 backdrop-blur-md border-b border-[#D2CBBB] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1d9f76]/15 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] shadow-xs">
              <Shield className="w-5 h-5 text-[#0f7058]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-[#1E1E1E] font-serif">SAHARA</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#F4EFE4] text-[#5E5A52] border border-[#D2CBBB]">
                  AI Welfare
                </span>
              </div>
              <p className="text-[11px] text-[#5E5A52] hidden sm:block">
                Armed Forces Health &amp; Operational Readiness System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsBreathingOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-[#0f7058] bg-[#F4EFE4] hover:bg-[#E3DDCF] border border-[#D2CBBB] rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <Wind className="w-3.5 h-3.5 text-[#1d9f76]" />
              <span>1-Min Breathing</span>
            </button>

            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#1E1E1E] hover:text-[#0f7058] bg-[#F4EFE4] border border-[#D2CBBB] rounded-full transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5E5A52]" />
              <span>WHO Standards</span>
            </button>

            {onOpenArchitecture && (
              <button
                onClick={onOpenArchitecture}
                className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-[#0f7058] hover:text-[#1d9f76] bg-[#1d9f76]/15 hover:bg-[#1d9f76]/25 border border-[#1d9f76]/30 rounded-full transition-all cursor-pointer shadow-2xs"
                title="View SIH System Architecture & Data Flow Diagram"
              >
                <Layers className="w-3.5 h-3.5 text-[#0f7058]" />
                <span>SIH Architecture</span>
              </button>
            )}

            <button
              id="btn-landing-login"
              onClick={() => (onOpenLogin ? onOpenLogin() : onEnterDashboard('personnel', 'p-001'))}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1d9f76] hover:bg-[#0f7058] rounded-full shadow-sm hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#efa02a]" />
              <span>Duty Echelon Sign-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Soldier & Hospital Doctor Care Theme */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#e9e4d8] text-[#1E1E1E]">
        {/* Background Image & Ambient Hospital Care Atmosphere */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=85"
            alt="Military medical doctor attending to soldier in field hospital"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.72] contrast-[1.1] transition-transform duration-1000"
          />
          {/* Theme-Tuned Warm Overlay: e9e4d8 (background) + 1d9f76 (primary) tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e9e4d8]/96 via-[#e9e4d8]/90 to-[#e9e4d8]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e9e4d8]/95 via-transparent to-[#e9e4d8]/95 opacity-80" />
        </div>

        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#efa02a]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-[320px] h-[320px] bg-[#1d9f76]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-5 max-w-4xl mx-auto">
            {/* Clinical Privilege Status Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#F4EFE4] border border-[#D2CBBB] shadow-xs text-xs font-semibold text-[#1E1E1E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1d9f76] animate-pulse" />
              <Stethoscope className="w-3.5 h-3.5 text-[#0f7058]" />
              <span>Section 14 Medical Secrecy &bull; Field Hospital Care &bull; Non-Punitive Logging</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1E1E1E] tracking-tight leading-[1.15] font-serif">
              Confidential care for soldiers. <br />
              <span className="text-[#0f7058]">
                Clear operational readiness for commanders.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5E5A52] max-w-2xl mx-auto leading-relaxed">
              SAHARA provides an early warning system for personnel fatigue, sleep debt, and cumulative strain. Clinical teams intervene early with restorative rest before exhaustion compromises health or mission readiness.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="btn-hero-echelon-login"
                onClick={() => (onOpenLogin ? onOpenLogin() : onEnterDashboard('personnel', 'p-001'))}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <Lock className="w-4 h-4 text-[#efa02a]" />
                <span>Access Echelon Sign-In (4 Levels)</span>
              </button>

              <button
                onClick={() => onEnterDashboard('personnel', 'p-001')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F4EFE4] hover:bg-[#E3DDCF] text-[#1E1E1E] font-semibold text-sm border border-[#D2CBBB] shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4 text-[#0f7058]" />
                <span>Quick View: Constable Rahul Verma</span>
              </button>

              {onOpenArchitecture && (
                <button
                  onClick={onOpenArchitecture}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-[#E3DDCF] text-[#0f7058] font-bold text-sm border border-[#1d9f76]/30 shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Layers className="w-4 h-4 text-[#0f7058]" />
                  <span>SIH Architecture Diagram</span>
                </button>
              )}
            </div>
          </div>

          {/* Picture-in-Picture: Doctor Assisting Soldier in Field Hospital */}
          <div className="relative rounded-2xl bg-[#F4EFE4]/95 border border-[#D2CBBB] p-4 sm:p-6 shadow-md backdrop-blur-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Visual Frame of Doctor & Soldier */}
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-[#D2CBBB] shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80"
                  alt="Doctor helping soldier during health assessment"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-[#efa02a]">
                    <span className="w-2 h-2 rounded-full bg-[#1d9f76] animate-pulse" />
                    <span>102nd Mountain Bn &bull; Medical Aid Post</span>
                  </div>
                  <div className="text-xs font-bold font-serif leading-snug mt-0.5">
                    Military Medical Officer Caring for Frontline Troops
                  </div>
                  <div className="text-[10px] text-stone-300">
                    Confidential Vitals &amp; Non-Punitive Recovery Exemption
                  </div>
                </div>
              </div>

              {/* Clinical Context & Interactive Telemetry */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1d9f76]/15 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058]">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E1E1E]">Active Clinical Care Protocol</div>
                      <div className="text-[11px] text-[#5E5A52]">SOP 4.2: Circadian Desynchrony &amp; Sleep Debt Reset</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1d9f76]/15 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                    Doctor Approved
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#e9e4d8]/80 border border-[#D2CBBB] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#5E5A52]">
                    <span className="font-semibold text-[#1E1E1E]">Service Member:</span>
                    <span className="font-mono">Lance Naik Amit Sharma (Bravo Coy)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5E5A52]">
                    <span className="font-semibold text-[#1E1E1E]">Attending Medical Officer:</span>
                    <span className="text-[#0f7058] font-medium">Capt. (Dr.) Ananya Sen, AMC</span>
                  </div>
                  <div className="flex items-center justify-between text-[#5E5A52] border-t border-[#D2CBBB]/60 pt-2">
                    <span className="font-semibold text-[#1E1E1E]">Clinical Recommendation:</span>
                    <span className="text-[#efa02a] font-bold">48-Hour High-Altitude Exemption</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-[#5E5A52]">
                    All clinical notes are sealed under Section 14 medical secrecy and cannot be used in disciplinary evaluations.
                  </p>
                  <button
                    onClick={() => setIsBreathingOpen(true)}
                    className="shrink-0 text-xs font-semibold text-[#0f7058] hover:text-[#1d9f76] flex items-center space-x-1 cursor-pointer pl-3"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Try 1-Min Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Core Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#D2CBBB] text-left">
            <div className="p-3 bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-[#1d9f76]/15 text-[#0f7058] flex items-center justify-center mb-1.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1E1E1E]">Medical Privilege</div>
              <div className="text-[11px] text-[#5E5A52] mt-0.5">Section 14 Protected</div>
            </div>

            <div className="p-3 bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-[#efa02a]/15 text-[#efa02a] flex items-center justify-center mb-1.5">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1E1E1E]">k ≥ 10 Anonymity</div>
              <div className="text-[11px] text-[#5E5A52] mt-0.5">Zero individual snooping</div>
            </div>

            <div className="p-3 bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-[#0f7058]/15 text-[#0f7058] flex items-center justify-center mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1E1E1E]">TreeSHAP AI</div>
              <div className="text-[11px] text-[#5E5A52] mt-0.5">100% Explainable factors</div>
            </div>

            <div className="p-3 bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-1.5">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#1E1E1E]">Non-Punitive Care</div>
              <div className="text-[11px] text-[#5E5A52] mt-0.5">Focus on recovery &amp; rest</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Operational Workflow Explainer */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F4EFE4] border-y border-[#D2CBBB]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f7058] bg-[#1d9f76]/15 px-3 py-1 rounded-full border border-[#1d9f76]/30">
              Operational Care Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] tracking-tight font-serif">
              How the SAHARA Care Protocol Works
            </h2>
            <p className="text-sm text-[#5E5A52] leading-relaxed">
              A 4-phase non-punitive health cycle connecting personnel check-ins directly to medical welfare support.
            </p>
          </div>

          {/* 4 Step Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              {
                num: 1,
                title: 'Daily Check-In',
                sub: 'Service Member Self-Report',
                icon: Heart
              },
              {
                num: 2,
                title: 'Strain Attribution',
                sub: 'TreeSHAP Clinical Breakdown',
                icon: Sparkles
              },
              {
                num: 3,
                title: 'Medical Triage',
                sub: 'Welfare Officer Support',
                icon: Activity
              },
              {
                num: 4,
                title: 'Readiness Matrix',
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
                      ? 'bg-[#1d9f76] text-white border-[#1d9f76] shadow-sm'
                      : 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isActive ? 'bg-[#0f7058] text-white' : 'bg-[#D2CBBB] text-[#1E1E1E]'
                      }`}
                    >
                      {step.num}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-[#efa02a]' : 'text-[#5E5A52]'}`}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs">{step.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-white/80' : 'text-[#5E5A52]'
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
          <div className="bg-[#E3DDCF] rounded-3xl border border-[#D2CBBB] p-6 sm:p-8 shadow-xs">
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0f7058] bg-[#1d9f76]/15 px-2.5 py-1 rounded-full border border-[#1d9f76]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0f7058]" />
                    <span>Phase 1: Confidential Daily Self-Report</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E]">
                    Personnel Log Sleep and Fatigue in Under 30 Seconds
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5A52] leading-relaxed">
                    Personnel log simple metrics: hours slept, perceived physical fatigue, and stress. Raw inputs remain strictly protected under Section 14 medical secrecy; commanding officers cannot view individual personal entries.
                  </p>
                  <ul className="space-y-2 text-xs text-[#5E5A52]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Zero disciplinary consequences or performance evaluation impact</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Actionable restorative suggestions (e.g. 90-minute sleep alignment)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Confidential request for medical welfare consultation</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('personnel', 'p-001')}
                      className="px-5 py-2.5 bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Open Service Member Check-In Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#efa02a]" />
                    </button>
                  </div>
                </div>

                {/* Interactive Live Mini-Simulator */}
                <div className="lg:col-span-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
                    <span className="text-xs font-bold text-[#1E1E1E] flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#1d9f76]" />
                      <span>Live Interactive Check-In Simulator</span>
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
                    <div className="flex justify-between text-xs font-medium text-[#5E5A52]">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#5E5A52]" />
                        Perceived Fatigue Level (1–5):
                      </span>
                      <span className="font-mono font-bold text-[#1E1E1E]">{simFatigue} / 5</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSimFatigue(lvl)}
                          className={`py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            simFatigue === lvl
                              ? 'bg-[#1d9f76] text-white border-[#1d9f76]'
                              : 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E] border-[#D2CBBB]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-[11px] text-[#5E5A52] leading-relaxed">
                    <strong className="text-[#1E1E1E]">Calculated Assessment:</strong> {simSleep < 6 ? 'Acute sleep deficit identified (-2.2h vs restorative baseline). Prescribing restorative rest period.' : 'Sleep hours within standard physiological recovery envelope.'}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0f7058] bg-[#1d9f76]/15 px-2.5 py-1 rounded-full border border-[#1d9f76]/30">
                    <Sparkles className="w-3.5 h-3.5 text-[#0f7058]" />
                    <span>Phase 2: Mathematical Factor Attribution</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E]">
                    Explainable AI: TreeSHAP Attribute Analysis
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5A52] leading-relaxed">
                    Rather than providing opaque predictions, SAHARA uses TreeSHAP (Tree Shapley Additive Explanations) to demonstrate mathematically exact factors: sleep deficit, duty cycle length, and environmental conditions.
                  </p>
                  <ul className="space-y-2 text-xs text-[#5E5A52]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Additive equation: Cumulative Strain = Base Baseline + Attributed Deviations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Transparent justification prior to any restorative intervention recommendation</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('welfare_officer', 'wo-001')}
                      className="px-5 py-2.5 bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Review Clinical SHAP Waterfall in Welfare Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#efa02a]" />
                    </button>
                  </div>
                </div>

                {/* Factor Contribution Visual Card */}
                <div className="lg:col-span-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 space-y-3.5 shadow-xs">
                  <span className="text-xs font-bold text-[#1E1E1E] block border-b border-[#D2CBBB] pb-2">
                    Sample Clinical TreeSHAP Waterfall
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-rose-700">+ Acute Sleep Deficit (4.5h vs 7.2h baseline)</span>
                        <span className="font-mono font-bold text-rose-700">+22.4 pts</span>
                      </div>
                      <div className="w-full h-2 bg-[#E3DDCF] rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full w-[70%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-[#efa02a]">+ Night Duty Rotation (3 consecutive shifts)</span>
                        <span className="font-mono font-bold text-[#efa02a]">+14.1 pts</span>
                      </div>
                      <div className="w-full h-2 bg-[#E3DDCF] rounded-full overflow-hidden">
                        <div className="h-full bg-[#efa02a] rounded-full w-[45%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-[#0f7058]">- High Squad Cohesion &amp; Rest Days</span>
                        <span className="font-mono font-bold text-[#0f7058]">-8.5 pts</span>
                      </div>
                      <div className="w-full h-2 bg-[#E3DDCF] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1d9f76] rounded-full w-[25%]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-[11px] text-[#5E5A52]">
                    Calculated Strain Index = <strong className="text-[#1E1E1E] font-mono">68/100 (Clinical Review Band)</strong> &bull; Validated under Section 14 medical secrecy.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0f7058] bg-[#1d9f76]/15 px-2.5 py-1 rounded-full border border-[#1d9f76]/30">
                    <Activity className="w-3.5 h-3.5 text-[#0f7058]" />
                    <span>Phase 3: Clinical Welfare Triage</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E]">
                    Medical Officers Receive Proactive Support Alerts
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5A52] leading-relaxed">
                    When consecutive check-in entries indicate severe fatigue (Index ≥ 65 across 48 hours), the assigned Medical Welfare Officer receives a confidential notification to schedule restorative duty adjustments.
                  </p>
                  <ul className="space-y-2 text-xs text-[#5E5A52]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Standard clinical operating protocols (SOP-WEL-01 through 05)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Roster impact simulation prior to recommending duty alterations</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('welfare_officer', 'wo-001')}
                      className="px-5 py-2.5 bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Sign In as Capt. Dr. Ananya Sen (Welfare Officer)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#efa02a]" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-2">
                    <span className="text-xs font-bold text-[#1E1E1E]">Medical Welfare Alert #CASE-882</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      Action Recommended
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1E1E]">
                    <strong>Service Member:</strong> Constable Rahul Verma (102nd Mountain Battalion)
                  </p>
                  <p className="text-xs text-[#5E5A52]">
                    <strong>Clinical Recommendation:</strong> 48-Hour High-Altitude Exemption &bull; Circadian Sleep Reset
                  </p>
                  <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-xs text-[#0f7058] font-medium">
                    Restorative consultation scheduled with Medical Officer. Protected under Section 14.
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0f7058] bg-[#1d9f76]/15 px-2.5 py-1 rounded-full border border-[#1d9f76]/30">
                    <Layers className="w-3.5 h-3.5 text-[#0f7058]" />
                    <span>Phase 4: Operational Readiness Matrix</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E]">
                    Command Readiness Awareness Without Intrusive Surveillance
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5A52] leading-relaxed">
                    Battalion commanders receive macro-level operational readiness metrics without micro-level inspection of personal records. Cohorts with fewer than 10 personnel are automatically suppressed with cryptographic k-anonymity to preserve absolute integrity.
                  </p>
                  <ul className="space-y-2 text-xs text-[#5E5A52]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Force readiness percentage aligned with WHO global defense health guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9f76]" />
                      <span>Executive intelligence briefs summarizing unit trends and fatigue rates</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => onEnterDashboard('command_viewer', 'cmd-001')}
                      className="px-5 py-2.5 bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs rounded-full cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <span>Sign In as Col. Vikram Rawat (Commanding Officer)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#efa02a]" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-[#1E1E1E] block border-b border-[#D2CBBB] pb-2">
                    Brigade Operational Matrix (102nd Mountain Infantry)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
                      <div className="text-[10px] text-[#5E5A52] uppercase font-mono">Force Readiness</div>
                      <div className="text-xl font-black text-[#1E1E1E] font-mono mt-0.5">88.4%</div>
                      <div className="text-[10px] text-[#0f7058] font-medium">Standard Met</div>
                    </div>
                    <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
                      <div className="text-[10px] text-[#5E5A52] uppercase font-mono">Night Shift Load</div>
                      <div className="text-xl font-black text-[#1E1E1E] font-mono mt-0.5">28.5%</div>
                      <div className="text-[10px] text-[#5E5A52]">Within 35% Guideline</div>
                    </div>
                  </div>
                  <div className="p-3 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-xs text-[#5E5A52]">
                    <Lock className="w-3.5 h-3.5 inline mr-1 text-[#0f7058]" />
                    <strong>Outpost Bravo (7 personnel):</strong> Anonymized data suppressed per Section 14 (cohort size &lt; 10).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Echelons Section: Clear Hierarchical RBAC Gate */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f7058] bg-[#1d9f76]/15 px-3 py-1 rounded-full border border-[#1d9f76]/30">
            Role-Based Access Control (RBAC)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] tracking-tight font-serif">
            Official Echelon Access Levels
          </h2>
          <p className="text-xs sm:text-sm text-[#5E5A52]">
            Each user is authenticated into an explicit security echelon with strictly demarcated portal visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level 1: Personnel */}
          <div className="bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] p-5 flex flex-col justify-between hover:border-[#1d9f76] transition-all shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1d9f76]/15 text-[#0f7058] border border-[#1d9f76]/30">
                  Tier 1 &bull; 1 Portal
                </span>
                <Heart className="w-4 h-4 text-[#1d9f76]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1E1E]">Service Member</h3>
                <div className="text-xs font-medium text-[#5E5A52]">Constable Rahul Verma</div>
              </div>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Personal daily check-ins, sleep tracking, and confidential recovery tools. Cannot access other personnel records.
              </p>
              <div className="pt-2 border-t border-[#D2CBBB] space-y-1 text-[11px] text-[#5E5A52]">
                <div className="text-[#0f7058] font-medium">&bull; 01 Personnel Portal (Self)</div>
                <div className="text-[#5E5A52]/60">&bull; No command or clinical triage access</div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onEnterDashboard('personnel', 'p-001')}
                className="w-full py-2 px-3 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate Tier 1</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#efa02a]" />
              </button>
            </div>
          </div>

          {/* Level 2: Welfare Officer */}
          <div className="bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] p-5 flex flex-col justify-between hover:border-[#1d9f76] transition-all shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1d9f76]/15 text-[#0f7058] border border-[#1d9f76]/30">
                  Tier 2 &bull; 2 Portals
                </span>
                <Activity className="w-4 h-4 text-[#0f7058]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1E1E]">Welfare Officer</h3>
                <div className="text-xs font-medium text-[#5E5A52]">Capt. (Dr.) Ananya Sen</div>
              </div>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Triage strain alerts, inspect TreeSHAP factor attributions, and issue restorative recovery recommendations.
              </p>
              <div className="pt-2 border-t border-[#D2CBBB] space-y-1 text-[11px] text-[#5E5A52]">
                <div className="text-[#0f7058] font-medium">&bull; 01 Personnel Portal</div>
                <div className="text-[#0f7058] font-medium">&bull; 02 Welfare Officer Portal</div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onEnterDashboard('welfare_officer', 'wo-001')}
                className="w-full py-2 px-3 rounded-full bg-[#0f7058] hover:bg-[#1d9f76] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate Tier 2</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#efa02a]" />
              </button>
            </div>
          </div>

          {/* Level 3: Commander */}
          <div className="bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] p-5 flex flex-col justify-between hover:border-[#1d9f76] transition-all shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#efa02a]/15 text-[#1E1E1E] border border-[#efa02a]/30">
                  Tier 3 &bull; 3 Portals
                </span>
                <Layers className="w-4 h-4 text-[#efa02a]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1E1E]">Commanding Officer</h3>
                <div className="text-xs font-medium text-[#5E5A52]">Col. Vikram Rawat</div>
              </div>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Macro unit readiness, deployment stress heatmaps, and executive intelligence briefs. Individual identities masked.
              </p>
              <div className="pt-2 border-t border-[#D2CBBB] space-y-1 text-[11px] text-[#5E5A52]">
                <div className="text-[#0f7058] font-medium">&bull; 01 Personnel &bull; 02 Welfare</div>
                <div className="text-[#0f7058] font-medium">&bull; 03 Commander Portal</div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onEnterDashboard('command_viewer', 'cmd-001')}
                className="w-full py-2 px-3 rounded-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate Tier 3</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#efa02a]" />
              </button>
            </div>
          </div>

          {/* Level 4: Admin / ML */}
          <div className="bg-[#F4EFE4] rounded-2xl border border-[#D2CBBB] p-5 flex flex-col justify-between hover:border-[#1d9f76] transition-all shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-200 text-[#1E1E1E] border border-[#D2CBBB]">
                  Tier 4 &bull; All 4 Portals
                </span>
                <Shield className="w-4 h-4 text-[#1E1E1E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1E1E]">Systems Admin</h3>
                <div className="text-xs font-medium text-[#5E5A52]">Maj. S. Iyer</div>
              </div>
              <p className="text-xs text-[#5E5A52] leading-relaxed">
                Full model telemetry, dataset drift monitoring, cryptographic privacy audit, and system governance.
              </p>
              <div className="pt-2 border-t border-[#D2CBBB] space-y-1 text-[11px] text-[#5E5A52]">
                <div className="text-[#0f7058] font-medium">&bull; Portals 01, 02, 03, 04</div>
                <div className="text-[#0f7058] font-medium">&bull; Full Administrative Access</div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onEnterDashboard('admin', 'adm-001')}
                className="w-full py-2 px-3 rounded-full bg-[#2E2E2E] hover:bg-[#1E1E1E] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authenticate Tier 4</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#efa02a]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Credential Banner Before Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1E1E1E] text-[#F4EFE4] mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#2E2E2E] border border-[#5E5A52] flex items-center justify-center mx-auto text-[#efa02a]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Cryptographically Enforced Echelon Access
          </h2>
          <p className="text-xs sm:text-sm text-[#D2CBBB] max-w-xl mx-auto leading-relaxed">
            Select your duty echelon on the login portal to review personal self-care, clinical welfare triage, or battalion readiness.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => (onOpenLogin ? onOpenLogin() : onEnterDashboard('personnel', 'p-001'))}
              className="px-8 py-3 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#efa02a]" />
              <span>Go to 4-Echelon Login Screen</span>
            </button>
            <button
              onClick={() => setIsBreathingOpen(true)}
              className="px-6 py-3 rounded-full bg-[#2E2E2E] hover:bg-[#3E3E3E] text-[#F4EFE4] font-semibold text-xs border border-[#5E5A52] transition-all cursor-pointer flex items-center gap-2"
            >
              <Wind className="w-3.5 h-3.5 text-[#efa02a]" />
              <span>Practice 1-Minute Tactical Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#151515] text-[#A89F8F] py-6 px-4 sm:px-6 lg:px-8 border-t border-[#2E2E2E] text-center text-xs">
        <p>
          SAHARA Defence Health Information System &bull; Directorate General of Armed Forces Medical Services &bull; Section 14 Medical Secrecy Certified &bull; WHO Global Digital Health Standards
        </p>
      </footer>
    </div>
  );
};
