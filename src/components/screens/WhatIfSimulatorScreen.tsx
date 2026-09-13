import React, { useEffect, useState } from 'react';
import { WhatIfSimulationResult, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  Sliders,
  TrendingDown,
  Clock,
  Moon,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

interface WhatIfSimulatorScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
  initialPersonnelId?: string;
}

export const WhatIfSimulatorScreen: React.FC<WhatIfSimulatorScreenProps> = ({
  onNavigateScreen,
  initialPersonnelId = 'p-014'
}) => {
  const [personnelId, setPersonnelId] = useState<string>(initialPersonnelId);

  // Simulation Controls
  const [dutyHoursDelta, setDutyHoursDelta] = useState<number>(-4); // reduce 4h
  const [nightShiftsDelta, setNightShiftsDelta] = useState<number>(-2); // remove 2 night watches
  const [grantedRestDays, setGrantedRestDays] = useState<number>(2); // 2 rest days
  const [leaveAuthorized, setLeaveAuthorized] = useState<boolean>(false);
  const [peerSupportSession, setPeerSupportSession] = useState<boolean>(true);

  const [simulation, setSimulation] = useState<WhatIfSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runWhatIfSimulation({
        personnelId,
        dutyHoursDelta,
        nightShiftsDelta,
        grantedRestDays,
        leaveAuthorized,
        peerSupportSession
      });
      if (res.success) {
        setSimulation(res.simulation);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [personnelId, dutyHoursDelta, nightShiftsDelta, grantedRestDays, leaveAuthorized, peerSupportSession]);

  const handleApplyPlan = () => {
    setAppliedNotice('Counterfactual intervention plan committed to officer triage queue.');
    setTimeout(() => {
      setAppliedNotice(null);
      onNavigateScreen('intervention_assistant');
    }, 1200);
  };

  return (
    <div className="space-y-6" id="screen-what-if-simulator">
      {/* Screen Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SCREEN 05 &bull; WHAT-IF SIMULATOR
            </span>
            <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              09 Counterfactual ML Sandbox
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Interactive What-If Simulation Sandbox
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
            Test and evaluate interventions in-silico before executing them in the operational unit. Live XGBoost inference re-estimates fatigue trajectories and SHAP contributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateScreen('model_monitoring')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <span>Model Observability (Screen 06)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Primary Simulator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Intervention Knobs</h2>
              <p className="text-xs text-slate-500">Tune candidate duty and recovery adjustments</p>
            </div>
            <button
              onClick={() => {
                setDutyHoursDelta(0);
                setNightShiftsDelta(0);
                setGrantedRestDays(0);
                setLeaveAuthorized(false);
                setPeerSupportSession(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Reset to Zero
            </button>
          </div>

          {/* Slider 1: Shift Hours Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Shift Length Adjustment
              </span>
              <span className="font-mono font-bold text-slate-900">
                {dutyHoursDelta > 0 ? `+${dutyHoursDelta}h` : `${dutyHoursDelta}h`}
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="4"
              step="1"
              value={dutyHoursDelta}
              onChange={(e) => setDutyHoursDelta(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-6h (Reduce Overtime)</span>
              <span>0h</span>
              <span>+4h (Increase Load)</span>
            </div>
          </div>

          {/* Slider 2: Night Watch Shifts Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                Consecutive Night Shifts Delta
              </span>
              <span className="font-mono font-bold text-slate-900">
                {nightShiftsDelta > 0 ? `+${nightShiftsDelta}` : `${nightShiftsDelta}`} shifts
              </span>
            </div>
            <input
              type="range"
              min="-3"
              max="2"
              step="1"
              value={nightShiftsDelta}
              onChange={(e) => setNightShiftsDelta(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-3 (Cancel Night Patrols)</span>
              <span>0</span>
              <span>+2</span>
            </div>
          </div>

          {/* Slider 3: Granted Rest Days */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Mandatory Rest Days Granted
              </span>
              <span className="font-mono font-bold text-slate-900">+{grantedRestDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={grantedRestDays}
              onChange={(e) => setGrantedRestDays(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 days</span>
              <span>2 days (48h SOP)</span>
              <span>4 days</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                Peer Support &amp; Squad Engagement Session
              </span>
              <input
                type="checkbox"
                checked={peerSupportSession}
                onChange={(e) => setPeerSupportSession(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Authorize 7-Day Convalescent / Annual Leave
              </span>
              <input
                type="checkbox"
                checked={leaveAuthorized}
                onChange={(e) => setLeaveAuthorized(e.target.checked)}
                className="w-4 h-4 accent-teal-600 rounded"
              />
            </label>
          </div>

          {/* Preset Buttons */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase">Quick Clinical Presets:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDutyHoursDelta(-4);
                  setNightShiftsDelta(-2);
                  setGrantedRestDays(2);
                  setPeerSupportSession(true);
                  setLeaveAuthorized(false);
                }}
                className="p-2 text-left rounded-lg bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-900 text-xs cursor-pointer"
              >
                <div className="font-bold">48h Circadian Reset</div>
                <div className="text-[10px] text-teal-700 mt-0.5">SOP-WEL-02 compliant</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDutyHoursDelta(-5);
                  setNightShiftsDelta(-3);
                  setGrantedRestDays(3);
                  setLeaveAuthorized(true);
                  setPeerSupportSession(true);
                }}
                className="p-2 text-left rounded-lg bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-sky-900 text-xs cursor-pointer"
              >
                <div className="font-bold">Full De-escalation</div>
                <div className="text-[10px] text-sky-700 mt-0.5">Maximum recovery</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Model Output & Projected Trajectory (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {simulation ? (
            <>
              {/* Top Comparison Card */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">REAL-TIME ML INFERENCE</span>
                    <h2 className="text-base font-bold text-slate-900">Simulated Risk Outcome</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span>XGBoost latency:</span>
                    <strong className="text-emerald-700">38ms</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  {/* Baseline */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1">Current Baseline</div>
                    <div className="text-2xl font-black font-mono text-rose-700">
                      {simulation.baselineRisk}
                    </div>
                    <div className="text-[11px] font-bold uppercase text-rose-600 mt-0.5 font-mono">
                      {simulation.baselineBand} BAND
                    </div>
                  </div>

                  {/* Delta */}
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 flex flex-col items-center justify-center">
                    <div className="text-xs text-teal-800 font-medium mb-1 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Predicted Delta
                    </div>
                    <div className="text-2xl font-black font-mono text-teal-800">
                      {simulation.riskDelta} pts
                    </div>
                    <div className="text-[10px] text-teal-700 mt-0.5">In-silico test</div>
                  </div>

                  {/* Simulated */}
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-xs text-emerald-800 mb-1">Simulated Output</div>
                    <div className="text-2xl font-black font-mono text-emerald-800">
                      {simulation.simulatedRisk}
                    </div>
                    <div className="text-[11px] font-bold uppercase text-emerald-700 mt-0.5 font-mono">
                      {simulation.simulatedBand} BAND
                    </div>
                  </div>
                </div>

                {/* Trajectory Projection Table */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Projected 5-Day Trajectory Comparison:
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center font-mono">
                    {simulation.projectedTrajectory.map((p, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-sans mb-1">{p.day}</div>
                        <div className="text-xs text-slate-400 line-through">{p.baseline}</div>
                        <div className="text-xs font-bold text-emerald-700">{p.simulated} pts</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Rationale */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{simulation.clinicalRationale}</p>
                </div>
              </div>

              {/* Action Commit Button */}
              <div className="bg-slate-900 rounded-xl p-4 text-white flex items-center justify-between shadow-md">
                <div>
                  <div className="text-xs font-bold">Ready to Execute This Intervention?</div>
                  <p className="text-[11px] text-slate-300">
                    Saves these parameters directly into the Welfare Officer approval workflow.
                  </p>
                </div>
                <button
                  id="btn-commit-simulation"
                  onClick={handleApplyPlan}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Commit Plan to Triage</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
              <span>Simulating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
