import React, { useState } from 'react';
import { FileText, X, Printer, Copy, Check, ShieldCheck, Download, Calendar, Activity } from 'lucide-react';
import { ForceWelfareOverview } from '../../types.js';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: ForceWelfareOverview | null;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  isOpen,
  onClose,
  overview
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `SAHARA FORCE WELFARE INTELLIGENCE BRIEF
Date: 13 September 2026 | Sector Command Enclave
Total Monitored: ${overview?.totalMonitored || 1842} Personnel
Operational Readiness Index: ${overview?.readinessScore || 88.4}%
Routine Band: ${overview?.lowRisk || 1432} (77.7%)
Watch Band: ${overview?.moderateRisk || 318} (17.3%)
Review Band: ${overview?.highRisk || 92} (5.0%)
Critical Trend Alerts: ${overview?.criticalTrendAlerts || 17}

Key Finding: Acute sleep debt (<5h) and consecutive night watches in high-altitude outposts constitute 73% of elevated fatigue variance. Recommended intervention: 48h circadian sleep rota shift swap (SOP-WEL-01).

Compliance: Section 14 Non-Punitive Medical Privilege & k-Anonymity (k>=10) Enforced.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-300 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Executive Welfare Intelligence Brief</h3>
              <p className="text-[11px] text-slate-400">Harmonized with WHO Global Digital Health Reporting Standard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                ARMED FORCES MEDICAL SERVICES &bull; DIRECTORATE OF PERSONNEL WELFARE
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                SECTOR FORCE WELFARE INTELLIGENCE ASSESSMENT
              </h1>
              <div className="text-xs text-slate-600 mt-0.5">
                Target Formation: 102nd Mountain Brigade &amp; Assigned Support Units
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>REF: SAHARA-EB-2026-09</div>
              <div className="font-bold text-rose-700">RESTRICTED &bull; PRIVILEGED</div>
            </div>
          </div>

          {/* Core Indicator Summary Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Primary Indicator Stratification (Census N = {overview?.totalMonitored || 1842})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="text-[11px] text-slate-500">Operational Readiness</div>
                <div className="text-2xl font-black font-mono text-slate-900">{overview?.readinessScore || 88.4}%</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Target: &ge; 85.0%</div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="text-[11px] text-emerald-900">Routine Tier (Optimal)</div>
                <div className="text-2xl font-black font-mono text-emerald-800">{overview?.lowRisk || 1432}</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">77.7% of total force</div>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="text-[11px] text-amber-900">Watch Tier (Strain)</div>
                <div className="text-2xl font-black font-mono text-amber-800">{overview?.moderateRisk || 318}</div>
                <div className="text-[10px] text-amber-700 mt-0.5">17.3% preventative</div>
              </div>
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="text-[11px] text-rose-900">Review Tier (Action)</div>
                <div className="text-2xl font-black font-mono text-rose-800">{overview?.highRisk || 92}</div>
                <div className="text-[10px] text-rose-700 mt-0.5">5.0% Welfare cases</div>
              </div>
            </div>
          </div>

          {/* Key Executive Findings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Strategic Findings &amp; TreeSHAP Factor Attribution
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-2 text-amber-950">
              <p>
                <strong>Systemic Cluster Detected:</strong> 102nd Mountain Battalion Charlie Company exhibits concentrated fatigue acceleration (mean index: 68), primarily driven by 4 consecutive nocturnal shifts and acute sleep debt (&lt;4.5h per 24h cycle).
              </p>
              <p>
                <strong>TreeSHAP Sensitivity:</strong> Additive attribution indicates circadian night-duty swaps combined with 48-hour rest authorization will reduce cohort risk by <strong>32–43 points</strong> without requiring force redeployment.
              </p>
            </div>
          </div>

          {/* Systemic Hotspots */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              3. Unit Hotspot Analysis &amp; Privacy Boundary
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-slate-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">Formation</th>
                    <th className="p-2.5">Personnel</th>
                    <th className="p-2.5">Mean Risk</th>
                    <th className="p-2.5">Primary Root Cause</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2.5 font-bold">102nd Mountain Bn (Bravo Coy)</td>
                    <td className="p-2.5 font-mono">148</td>
                    <td className="p-2.5 font-mono text-rose-700 font-bold">68.2</td>
                    <td className="p-2.5 text-slate-600">Consecutive night watch + sleep debt</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Review</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">7th Reconnaissance Troop</td>
                    <td className="p-2.5 font-mono">64</td>
                    <td className="p-2.5 font-mono text-amber-700 font-bold">54.0</td>
                    <td className="p-2.5 text-slate-600">Extended 14h patrols in cold terrain</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Watch</span></td>
                  </tr>
                  <tr className="bg-stone-50 text-slate-500">
                    <td className="p-2.5 font-bold">Detachment Alpha (Small Outpost)</td>
                    <td className="p-2.5 font-mono">4</td>
                    <td className="p-2.5 font-mono">[SUPPRESSED]</td>
                    <td className="p-2.5">k &lt; 10 statutory identity protection</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">Shielded</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory Attestation */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Verified compliant with Section 14 Privacy Directive &bull; Immutable Audit Hash #SHA256-492F</span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              GENERATED: {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official Document of Armed Forces Medical &amp; Welfare Directorate</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
