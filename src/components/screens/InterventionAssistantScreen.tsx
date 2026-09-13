import React, { useEffect, useState } from 'react';
import { InterventionItem, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  Stethoscope,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';

interface InterventionAssistantScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
}

export const InterventionAssistantScreen: React.FC<InterventionAssistantScreenProps> = ({
  onNavigateScreen
}) => {
  const [interventions, setInterventions] = useState<InterventionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('int-001');

  // RAG Interactive Assistant State
  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [ragCitations, setRagCitations] = useState<Array<{ code: string; title: string; legalBasis: string }>>([]);
  const [ragLoading, setRagLoading] = useState(false);
  const [officerNote, setOfficerNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadInterventions = async () => {
    setLoading(true);
    try {
      const res = await api.getInterventions();
      if (res.success) {
        setInterventions(res.interventions);
      }
    } catch (err) {
      console.error('Failed to load interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'dismiss' | 'complete') => {
    try {
      const res = await api.updateInterventionAction(id, action, officerNote);
      if (res.success) {
        setActionSuccess(`Intervention ${action.toUpperCase()} successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
        setOfficerNote('');
        loadInterventions();
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleRAGSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    try {
      const res = await api.getEvidenceGroundedGuidance(ragQuery);
      if (res.success) {
        setRagAnswer(res.result.answer);
        setRagCitations(res.result.citations);
      }
    } catch (err) {
      console.error('Failed RAG search:', err);
    } finally {
      setRagLoading(false);
    }
  };

  const selectedItem = interventions.find((i) => i.id === selectedInterventionId) || interventions[0];

  return (
    <div className="space-y-6" id="screen-intervention-assistant">
      {/* Screen Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SCREEN 04 &bull; INTERVENTION ASSISTANT
            </span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              05 Evidence-Grounded &bull; 07 Human-Controlled
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Evidence-Grounded Welfare Interventions
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
            AI recommends specific clinical and scheduling protocols grounded in official Armed Forces SOPs. Humans decide and authorize all final operational directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateScreen('what_if_simulator')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Test in What-If Simulator (Screen 05)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Interventions Queue & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interventions List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Active Welfare Interventions Queue</h2>
            <span className="text-xs text-slate-500 font-mono">{interventions.length} Protocols</span>
          </div>

          <div className="space-y-2.5">
            {interventions.map((item) => {
              const isSelected = item.id === selectedInterventionId;
              let statusColor = 'bg-slate-100 text-slate-700 border-slate-200';
              if (item.status === 'recommended') statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
              else if (item.status === 'approved') statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              else if (item.status === 'completed') statusColor = 'bg-sky-50 text-sky-700 border-sky-200';
              else if (item.status === 'dismissed') statusColor = 'bg-slate-100 text-slate-500 border-slate-200';

              return (
                <div
                  key={item.id}
                  id={`intervention-item-${item.id}`}
                  onClick={() => setSelectedInterventionId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${statusColor}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-2 font-mono">
                    Target: {item.targetPersonnelToken} &bull; {item.targetUnitName}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-teal-700 font-bold font-mono">
                      -{item.projectedRiskReduction} pts expected reduction
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">Pre-risk: {item.preInterventionRisk}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Detail + Policy RAG Citation + Human Approval (7 cols) */}
        {selectedItem && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      INTERVENTION DOSSIER
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {selectedItem.id}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{selectedItem.title}</h2>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">
                    Subject: {selectedItem.targetPersonnelToken} ({selectedItem.targetUnitName})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Predicted Risk Drop</div>
                  <div className="text-xl font-bold text-teal-700 font-mono">
                    -{selectedItem.projectedRiskReduction} pts
                  </div>
                </div>
              </div>

              {/* Policy Grounding (RAG Context Quote) */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-1.5 text-slate-800 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>Approved Regulatory Citation: {selectedItem.policyCitation}</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{selectedItem.ragEvidenceQuote}&rdquo;
                </p>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  Verified against Armed Forces Mental Health &amp; Welfare SOP Knowledge Base (Gemini 3.8 Flash RAG Service)
                </div>
              </div>

              {/* Status & Officer Notes */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">Officer Clinical / Operational Notes:</div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedItem.officerNotes || 'No notes logged yet.'}
                </p>
              </div>

              {/* Closed-Loop Outcome Tracking */}
              {selectedItem.status === 'completed' && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs">
                  <div className="font-bold text-sky-900 mb-1">10 Closed-Loop Verification Registered:</div>
                  <div className="flex items-center justify-between text-sky-800 font-mono">
                    <span>Pre-Intervention Strain: {selectedItem.preInterventionRisk}</span>
                    <span>&rarr;</span>
                    <span className="font-bold">Post-Intervention Verified: {selectedItem.postInterventionRisk} pts</span>
                  </div>
                </div>
              )}

              {/* Human Decision Controls */}
              {selectedItem.status === 'recommended' && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-bold text-slate-900">07 Human-Controlled Authorization:</div>
                  <textarea
                    rows={2}
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    placeholder="Enter clinical rationale or operational roster coordination notes prior to approval..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-500 bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-approve-intervention"
                      onClick={() => handleAction(selectedItem.id, 'approve')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authorize Protocol</span>
                    </button>
                    <button
                      id="btn-dismiss-intervention"
                      onClick={() => handleAction(selectedItem.id, 'dismiss')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Dismiss Recommendation</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedItem.status === 'approved' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approved by {selectedItem.approvedBy}</span>
                  </div>
                  <button
                    onClick={() => handleAction(selectedItem.id, 'complete')}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Mark Protocol Completed (Measure Outcome)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive RAG SOP Explorer Panel */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Interactive SOP Guidance Engine (Gemini 3.8 Flash RAG)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Forces Regulations Corpus</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Query armed forces regulations, sleep hygiene directives, or fatigue management protocols in real-time.
        </p>

        <form onSubmit={handleRAGSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={ragQuery}
            onChange={(e) => setRagQuery(e.target.value)}
            placeholder="e.g. What is the mandatory recovery protocol after three consecutive night duties?"
            className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-500 bg-white"
          />
          <button
            type="submit"
            disabled={ragLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {ragLoading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Consult SOP</span>
          </button>
        </form>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-3">
          <span>Sample Directives:</span>
          <button
            type="button"
            onClick={() => setRagQuery('What rest is mandatory after continuous 45+ day mountain deployment?')}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            Post-Deployment Rest (SOP-WEL-01)
          </button>
          <button
            type="button"
            onClick={() => setRagQuery('What are the rules regarding night watch shift limits and circadian rest?')}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            Night Shift Governance (SOP-WEL-02)
          </button>
          <button
            type="button"
            onClick={() => setRagQuery('Are wellness check-ins protected from disciplinary review under Section 14?')}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            Section 14 Privacy Directives (SOP-WEL-04)
          </button>
        </div>

        {ragAnswer && (
          <div className="p-4 rounded-lg bg-teal-50/40 border border-teal-100 text-xs text-slate-800 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Evidence-Grounded Policy Finding:</span>
            </div>
            <p className="leading-relaxed whitespace-pre-line text-slate-700">{ragAnswer}</p>
            {ragCitations.length > 0 && (
              <div className="mt-2 pt-2 border-t border-teal-200/60 text-[11px] text-slate-500 font-mono">
                Cited Directives: {ragCitations.map((c) => `${c.code} (${c.title})`).join('; ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
