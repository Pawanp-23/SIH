import React, { useState, useEffect } from 'react';
import { Wind, X, Play, Pause, RotateCcw, Heart, CheckCircle2, Shield } from 'lucide-react';

interface TacticalResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const TacticalResetModal: React.FC<TacticalResetModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<'box' | 'wind_down' | 'quick'>('box');

  const techniques = {
    box: { name: 'Tactical Box Breathing', label: '4-4-4-4 Protocol', desc: 'Standard military autonomic reset to lower cortisol and sharpen operational focus.' },
    wind_down: { name: 'Circadian Wind-Down', label: 'Post-Night Watch', desc: 'Extended exhalation to trigger parasympathetic relaxation before sleep.' },
    quick: { name: '30-Second Micro Reset', label: 'Duty Transition', desc: 'Rapid grounding between high-stress shift handovers.' }
  };

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            if (phase === 'inhale') {
              setPhase('hold1');
              return 4;
            } else if (phase === 'hold1') {
              setPhase('exhale');
              return 4;
            } else if (phase === 'exhale') {
              setPhase('hold2');
              return 4;
            } else {
              setPhase('inhale');
              setCycle((c) => c + 1);
              setCompletedCycles((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    setCycle(1);
  };

  if (!isOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return { action: 'Inhale Slowly', hint: 'Deeply through the nose, expand your belly', color: 'text-orange-600', scale: 'scale-125 bg-orange-100/70 border-orange-400' };
      case 'hold1':
        return { action: 'Hold Breath', hint: 'Stillness, soften your jaw and shoulders', color: 'text-amber-600', scale: 'scale-125 bg-amber-100/70 border-amber-400' };
      case 'exhale':
        return { action: 'Exhale Smoothly', hint: 'Gently out through the mouth, let go of strain', color: 'text-emerald-600', scale: 'scale-90 bg-emerald-100/70 border-emerald-400' };
      case 'hold2':
        return { action: 'Rest in Stillness', hint: 'Notice the quiet before the next breath', color: 'text-slate-600', scale: 'scale-90 bg-slate-100/70 border-slate-300' };
    }
  };

  const currentInfo = getPhaseInstruction();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border border-amber-900/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Tactical Reset &amp; Breathwork</h3>
                <span className="text-[10px] font-semibold font-mono bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                  Headspace x Tactical Care
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous nervous system decompression for operational resilience</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technique Switcher */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-3 gap-2 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/60">
            {(['box', 'wind_down', 'quick'] as const).map((tech) => (
              <button
                key={tech}
                onClick={() => {
                  setSelectedTechnique(tech);
                  handleReset();
                }}
                className={`py-1.5 px-2 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTechnique === tech
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div>{techniques[tech].label}</div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            {techniques[selectedTechnique].desc}
          </p>
        </div>

        {/* Animated Breathing Orb Canvas */}
        <div className="py-8 flex flex-col items-center justify-center relative min-h-[280px]">
          {/* Outer Pulsing Aura */}
          <div
            className={`w-52 h-52 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ease-in-out shadow-lg ${currentInfo.scale}`}
          >
            {/* Inner Core */}
            <div className="w-36 h-36 rounded-full bg-white/90 border border-amber-900/10 flex flex-col items-center justify-center p-4 text-center shadow-inner">
              <span className={`text-xs font-bold uppercase tracking-wider ${currentInfo.color} mb-1`}>
                {currentInfo.action}
              </span>
              <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {countdown}s
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">
                Cycle {cycle} of 4
              </span>
            </div>
          </div>

          {/* Calming Guiding Cue */}
          <div className="mt-6 text-center max-w-xs px-4">
            <p className="text-xs font-medium text-slate-700 animate-pulse">
              &ldquo;{currentInfo.hint}&rdquo;
            </p>
          </div>
        </div>

        {/* Controls & Metrics */}
        <div className="px-6 py-4 bg-white border-t border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed: <strong className="text-slate-800 font-mono">{completedCycles}</strong> cycles</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Reset cycle"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{completedCycles > 0 ? 'Resume' : 'Begin Reset'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tactical Grounding Tip Footer */}
        <div className="px-6 py-2.5 bg-amber-50/60 border-t border-amber-100 text-[11px] text-amber-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>Proven to lower resting pulse by 6–10 BPM within 120 seconds.</span>
          </span>
          <span className="font-mono text-[10px] text-amber-700">Confidential Enclave</span>
        </div>
      </div>
    </div>
  );
};
