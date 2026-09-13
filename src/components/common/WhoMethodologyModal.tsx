import React, { useState } from 'react';
import { BookOpen, X, Shield, Cpu, Activity, CheckCircle, Lock, ExternalLink, HelpCircle } from 'lucide-react';

interface WhoMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhoMethodologyModal: React.FC<WhoMethodologyModalProps> = ({ isOpen, onClose }) => {
  const [activePillar, setActivePillar] = useState<'readiness' | 'fatigue' | 'shap' | 'privacy'>('readiness');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border border-stone-300 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header (WHO GDHM Authority Style) */}
        <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Indicator Methodology &amp; Clinical Guidance
                </h2>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  WHO GDHM STANDARD
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official definitions, TreeSHAP formulations, and statutory privacy benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-stone-100/60 border-b border-stone-200/80 flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'readiness', label: '1. Force Readiness Index', icon: Activity },
            { id: 'fatigue', label: '2. Cumulative Fatigue (3 Bands)', icon: CheckCircle },
            { id: 'shap', label: '3. TreeSHAP Attribution Model', icon: Cpu },
            { id: 'privacy', label: '4. k-Anonymity & Section 14', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activePillar === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePillar(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold border-t border-x transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-blue-900 border-stone-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-stone-200/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed bg-white">
          {activePillar === 'readiness' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 text-sm">Pillar I: Operational Readiness &amp; Force Vitality</span>
                  <span className="font-mono text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">IND-ORD-01</span>
                </div>
                <p className="text-blue-900">
                  Measures the overall percentage of monitored service members currently operating within optimal circadian, physiological, and psychological parameters.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="text-slate-500 text-[11px] mb-0.5">Target Benchmark</div>
                  <div className="text-base font-bold text-slate-900 font-mono">&ge; 85.0%</div>
                  <div className="text-[10px] text-emerald-700 mt-1">Force standard for deployment capability</div>
                </div>
                <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="text-slate-500 text-[11px] mb-0.5">Current Force Status</div>
                  <div className="text-base font-bold text-emerald-700 font-mono">88.4% (Optimal)</div>
                  <div className="text-[10px] text-slate-500 mt-1">1,432 of 1,842 in Routine Band</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Calculation Formulation</h4>
                <p className="font-mono text-[11px] bg-slate-900 text-teal-400 p-3 rounded-xl border border-slate-800">
                  ReadinessIndex = (N_routine * 1.0 + N_watch * 0.65 + N_review * 0.15) / N_total * 100
                </p>
                <p className="text-slate-500 text-[11px] mt-2">
                  Weighted by clinical impact: Members in the Review tier require immediate operational adjustment to prevent critical attrition.
                </p>
              </div>
            </div>
          )}

          {activePillar === 'fatigue' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-sm">Pillar II: Tri-Tier Welfare Stratification</span>
                  <span className="font-mono text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">IND-FAT-02</span>
                </div>
                <p className="text-amber-900">
                  Continuous classification based on sleep duration, consecutive night duties, self-reported strain, and shift length.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-emerald-950">Routine Band (0–49 pts) • 1,432 Personnel (77.7%)</div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Restorative sleep (&gt;7.0h), sustainable duty cycles, low perceived strain. Standard operational routine maintained.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-amber-950">Watch Band (50–69 pts) • 318 Personnel (17.3%)</div>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Emerging sleep debt (&lt;6h), consecutive shifts &gt;10h, mild circadian desynchronization. Triggers preventative peer check-in.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-rose-950">Review Band (70–100 pts) • 92 Personnel (5.0%)</div>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      Severe sleep deficit, consecutive night duties (&ge;3), acute fatigue velocity. Automatically triggers Welfare Officer case triage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePillar === 'shap' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 text-sm">Pillar III: TreeSHAP Explainability Engine</span>
                  <span className="font-mono text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded">ALGO-SHAP-V1.2</span>
                </div>
                <p className="text-purple-900">
                  Replaces black-box predictions with exact Shapley values. Ensures that every score increase or decrease is mathematically traceable to specific operational and physiological drivers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Mathematical Additive Property</h4>
                <div className="p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs">
                  f(x) = &phi;<sub>0</sub> + &sum;<sub>i=1</sub><sup>M</sup> &phi;<sub>i</sub>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 text-[11px]">
                  <li><strong>&phi;<sub>0</sub> (Base Value):</strong> 32.0 pts — The expected average risk across the entire uniformed population.</li>
                  <li><strong>&phi;<sub>i</sub> (Feature Contribution):</strong> Exact points added or subtracted by sleep shortfall (+18.5), night watch (+14.2), duty hours (+9.4), and squad support (-5.8).</li>
                  <li><strong>Model Verification:</strong> F1-score: 0.84, Recall: 0.89, ROC-AUC: 0.91 on 18,400 training duty cycles.</li>
                </ul>
              </div>
            </div>
          )}

          {activePillar === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-sm">Pillar IV: Statutory Medical Privilege &amp; k-Anonymity</span>
                  <span className="font-mono text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">STAT-SEC-14</span>
                </div>
                <p className="text-emerald-900">
                  Section 14 Armed Forces Directives guarantee that voluntary wellbeing logs can never be cited in performance appraisals, disciplinary hearings, or promotion boards.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="font-bold text-slate-900">k-Anonymity Threshold (k &ge; 10):</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    When commanders view unit heatmaps, any detachment or squad with fewer than 10 reporting members (e.g. Detachment Alpha, N=4) is automatically masked to eliminate the possibility of inferring individual health status.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="font-bold text-slate-900">Cryptographic Append-Only Audit Trail:</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Every database read by any user is logged with SHA-256 tamper-evident integrity hashes, capturing the actor ID, operational justification, and enforced privacy boundary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Harmonized with WHO Global Health Data Standards &amp; Armed Forces SOP-WEL-01</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
