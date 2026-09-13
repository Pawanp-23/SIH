import React from 'react';
import { X, Clock, ShieldCheck, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToRole: (userId: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToRole
}) => {
  if (!isOpen) return null;

  const protocols = [
    {
      phase: '01 Predictive',
      title: 'Detects Risk Before Crisis',
      roleId: 'cmd-singh',
      summary: 'Continuous aggregate monitoring across 1,842 personnel identifies early fatigue and strain velocity before operational failure occurs.',
      actionDetail: 'Inspect Screen 01 Force Overview (1,432 low, 318 watch, 92 review, 17 critical trend alerts).'
    },
    {
      phase: '02 Temporal',
      title: 'Tracks How Risk Evolves Over Time',
      roleId: 'p-014',
      summary: 'Tracks progressive fatigue accumulation: Normal welfare profile (34) → Deployment extends (46) → Night duties increase (61) → Rest decreases (78).',
      actionDetail: 'Inspect Screen 03 Personnel View to see the exact 4-step temporal trajectory curve.'
    },
    {
      phase: '03 Explainable',
      title: 'TreeSHAP Mathematical Factor Attribution',
      roleId: 'p-014',
      summary: 'Isolates exact additive feature contributions: Sleep deficit (+18.5), night watch (+14.2), duty overtime (+9.4), balanced by squad support (-5.8).',
      actionDetail: 'Inspect Screen 03 TreeSHAP waterfall decomposition from base model expectation (32.0) to final score (78.0).'
    },
    {
      phase: '04 Actionable',
      title: 'Recommends Concrete Welfare Interventions',
      roleId: 'wo-kumar',
      summary: 'Translates high-risk indicators into concrete operational and clinical actions (e.g. 48h rest, night rotation swap, peer check-in).',
      actionDetail: 'Open Screen 04 Intervention Assistant to view active intervention queue and projected point drops.'
    },
    {
      phase: '05 Evidence-Grounded',
      title: 'RAG Retrieves Approved Regulations & SOPs',
      roleId: 'wo-kumar',
      summary: 'Interventions cite official armed forces welfare directives and circadian recovery rules via Gemini 3.8 Flash RAG.',
      actionDetail: 'Query the interactive SOP Assistant in Screen 04 to verify official regulatory citations.'
    },
    {
      phase: '06 Privacy-First',
      title: 'Pseudonymization + RBAC + Section 14 Mandate',
      roleId: 'cmd-singh',
      summary: 'No PII in ML models. Small cohorts (Detachment Alpha, N=4) are suppressed under strict k-anonymity (k ≥ 10). Cryptographic audit trail logs every access.',
      actionDetail: 'Inspect Screen 02 for Detachment Alpha suppression and Screen 07 for tamper-evident audit logs.'
    },
    {
      phase: '07 Human-Controlled',
      title: 'AI Supports; Humans Decide',
      roleId: 'wo-kumar',
      summary: 'The system strictly assists and advises. Welfare officers retain full authority to authorize, modify with clinical notes, or dismiss any protocol.',
      actionDetail: 'Review authorization controls and officer note inputs in Screen 04 Intervention Assistant.'
    },
    {
      phase: '08 Organizational',
      title: 'Finds Systemic Workload Problems',
      roleId: 'cmd-singh',
      summary: 'Aggregates unit-level strain to diagnose organizational workload imbalance, shift overruns, and deployment burnout clusters.',
      actionDetail: 'Review Systemic Workload Hotspots in Screen 01 and Battalion Heatmap Matrix in Screen 02.'
    },
    {
      phase: '09 What-If Sim',
      title: 'Tests Interventions Before Action',
      roleId: 'wo-kumar',
      summary: 'Interactive counterfactual simulation playground tests shift reductions, rest days, and leave authorization in-silico with live XGBoost inference.',
      actionDetail: 'Use Screen 05 What-If Simulator sliders to simulate dropping risk from 78 down to 43 points.'
    },
    {
      phase: '10 Closed-Loop',
      title: 'Measures Intervention Effectiveness',
      roleId: 'wo-kumar',
      summary: 'Registers pre-intervention baseline vs post-intervention verified strain to ensure continuous learning and clinical accountability.',
      actionDetail: 'Mark an intervention complete in Screen 04 to log closed-loop verified post-risk.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">System Verification &amp; Protocol Walkthrough</h3>
              <p className="text-[11px] text-slate-400 font-normal">Operational verification across Service Member, Officer, and Command tiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protocols List */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {protocols.map((step, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {step.phase}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.summary}
                </p>
                <div className="text-[11px] text-slate-500 flex items-center pt-0.5">
                  <strong className="text-slate-700 mr-1">Verification:</strong> {step.actionDetail}
                </div>
              </div>

              <button
                id={`btn-jump-step-${idx + 1}`}
                onClick={() => {
                  onJumpToRole(step.roleId);
                  onClose();
                }}
                className="shrink-0 self-start sm:self-center px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs border border-slate-800 hover:border-slate-700"
              >
                Inspect View
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Complies with Armed Forces Health Privacy Directives</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 transition-all text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
