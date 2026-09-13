import React, { useState, useEffect } from 'react';
import { UserProfile, WelfareCase, CaseStatus, SyntheticHRRecord } from '../../types.js';
import { api } from '../../api/client.js';
import { StatusBadge } from '../common/StatusBadge.js';
import {
  HeartHandshake,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  XCircle,
  BookOpen,
  Calendar,
  AlertTriangle,
  UserCheck,
  Check
} from 'lucide-react';

interface WelfareDashboardProps {
  user: UserProfile;
}

export const WelfareDashboard: React.FC<WelfareDashboardProps> = ({ user }) => {
  const [cases, setCases] = useState<WelfareCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<WelfareCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  // Case Action Form
  const [actionStatus, setActionStatus] = useState<CaseStatus>('follow_up_scheduled');
  const [actionNote, setActionNote] = useState('');
  const [actionDueAt, setActionDueAt] = useState('2026-09-14T14:00:00Z');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // Recommendation Review Note
  const [recNotes, setRecNotes] = useState<Record<string, string>>({});

  // HRMS Roster Audit Demonstrator
  const [hrRecordsCount, setHrRecordsCount] = useState<number | null>(null);
  const [hrFlaggedPersonnel, setHrFlaggedPersonnel] = useState<any[]>([]);
  const [hrImporting, setHrImporting] = useState(false);

  // Directives & SOP Search
  const [sopQuery, setSopQuery] = useState('What are the rest cycle mandates following consecutive night shifts?');
  const [sopResult, setSopResult] = useState<{ answer: string; sources: string[] } | null>(null);
  const [sopSearching, setSopSearching] = useState(false);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await api.getCases();
      if (res.success) {
        setCases(res.cases);
        if (res.cases.length > 0 && !selectedCase) {
          setSelectedCase(res.cases[0]);
        } else if (selectedCase) {
          const updated = res.cases.find((c) => c.id === selectedCase.id);
          if (updated) setSelectedCase(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [user.id]);

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setActionSubmitting(true);
    try {
      const res = await api.updateCase(selectedCase.id, actionStatus, actionNote, actionDueAt);
      if (res.success) {
        setSelectedCase(res.case);
        setActionModalOpen(false);
        setActionNote('');
        loadCases();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update case record');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleReviewRec = async (recId: string, decision: 'accepted' | 'dismissed') => {
    if (!selectedCase) return;
    const note = recNotes[recId] || (decision === 'accepted' ? 'Authorized by Welfare Officer' : 'Dismissed after clinical review');
    try {
      const res = await api.reviewRecommendation(selectedCase.id, recId, decision, note);
      if (res.success) {
        setSelectedCase(res.case);
        loadCases();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record decision');
    }
  };

  const handleRunHRImportDemo = async () => {
    setHrImporting(true);
    const sampleBatch: SyntheticHRRecord[] = [
      { personnelId: 'p-005', date: '2026-09-12', dutyHours: 14, nightShift: true, deploymentDays: 45, daysSinceRest: 18, transfersCount: 1 },
      { personnelId: 'p-014', date: '2026-09-12', dutyHours: 13, nightShift: true, deploymentDays: 20, daysSinceRest: 9, transfersCount: 0 },
      { personnelId: 'p-008', date: '2026-09-12', dutyHours: 8, nightShift: false, deploymentDays: 10, daysSinceRest: 2, transfersCount: 0 },
      { personnelId: 'p-025', date: '2026-09-12', dutyHours: 13.5, nightShift: true, deploymentDays: 70, daysSinceRest: 22, transfersCount: 2 }
    ];

    try {
      const res = await api.importHR(sampleBatch);
      if (res.success) {
        setHrRecordsCount(res.result.totalImported);
        setHrFlaggedPersonnel(res.result.flaggedPersonnel);
      }
    } catch (err: any) {
      alert(err.message || 'Roster audit failed');
    } finally {
      setHrImporting(false);
    }
  };

  const handleSearchSOP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopQuery.trim()) return;
    setSopSearching(true);
    try {
      const res = await api.searchSOP(sopQuery);
      setSopResult(res);
    } catch (err: any) {
      alert(err.message || 'Directive search failed');
    } finally {
      setSopSearching(false);
    }
  };

  const openCasesCount = cases.filter((c) => c.status !== 'closed').length;
  const reviewAlertsCount = cases.filter((c) => c.latestBand === 'review').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Officer Header Card */}
      <div className="bg-slate-950 text-slate-100 rounded-xl p-6 border border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Welfare Triage &amp; Case Oversight
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded font-mono bg-teal-950/80 text-teal-300 border border-teal-800/60">
              102nd Mountain Battalion
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Direct clinical oversight for assigned consenting personnel. Evaluates multi-factor strain escalations,
            reviews standard protocol intervention cards, and maintains auditable welfare follow-up actions.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Active Cases</span>
            <span className="text-xl font-bold font-mono text-rose-400">{openCasesCount}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Review Flag</span>
            <span className="text-xl font-bold font-mono text-amber-400">{reviewAlertsCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Triage Queue (Left) & Selected Case Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Case Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm tracking-tight flex items-center">
                  <HeartHandshake className="w-4 h-4 mr-2 text-teal-600" />
                  Assigned Welfare Cases
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Prioritized by score escalation and scheduled review dates</p>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                {cases.length} records
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {cases.map((kase) => {
                const isSelected = selectedCase?.id === kase.id;
                return (
                  <div
                    key={kase.id}
                    id={`case-item-${kase.id}`}
                    onClick={() => setSelectedCase(kase)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/60 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-slate-900">{kase.personnelAlias}</span>
                          <StatusBadge type="band" value={kase.latestBand} />
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-normal leading-relaxed">
                          {kase.reason}
                        </p>
                      </div>
                      <StatusBadge type="caseStatus" value={kase.status} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        Due: {new Date(kase.dueAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold font-mono text-slate-700">
                        Index: {kase.latestIndex}/100
                      </span>
                    </div>
                  </div>
                );
              })}

              {cases.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active welfare cases in assigned queue.
                </div>
              )}
            </div>
          </div>

          {/* Section: Shift Duty & Workload Audit (HRMS Feed) */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                  Roster &amp; Shift Duty Audit (HRMS Feed)
                </h4>
              </div>
              <button
                id="btn-run-hr-import"
                onClick={handleRunHRImportDemo}
                disabled={hrImporting}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
              >
                {hrImporting ? 'Auditing...' : 'Run Audit Batch'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Audits roster logs for operational overload independently of service member self-reports.
              Flags excessive consecutive duty hours and night watch cycles.
            </p>

            {hrRecordsCount !== null && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Batch Processed: {hrRecordsCount} Service Records</span>
                  <span className="text-rose-600 font-mono font-bold">{hrFlaggedPersonnel.length} Threshold Alerts</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {hrFlaggedPersonnel.map((f, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 flex items-start leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 mt-1.5 shrink-0" />
                      <span><strong className="text-slate-800 font-mono">{f.personnelId.toUpperCase()}</strong>: {f.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Case Dossier Detail (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCase ? (
            <div id="case-detail-panel" className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="font-semibold text-slate-900 text-base tracking-tight">
                      Case Dossier • {selectedCase.personnelAlias}
                    </h3>
                    <StatusBadge type="band" value={selectedCase.latestBand} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Assigned Officer: Subedar Arjun Kumar &bull; Action Deadline: {new Date(selectedCase.dueAt).toLocaleString()}
                  </p>
                </div>

                <button
                  id="btn-open-action-dialog"
                  onClick={() => setActionModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center shadow-xs transition-all self-start sm:self-center"
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                  Update Status / Action
                </button>
              </div>

              {/* Clinical Metrics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 text-center">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Health Index</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">{selectedCase.latestIndex}/100</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Consecutive Days</span>
                  <span className="text-xl font-bold font-mono text-amber-600 mt-0.5 block">{selectedCase.consecutiveAlertDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Consult Request</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1.5 block">
                    {selectedCase.supportRequested ? 'Direct Request' : 'Routine Monitoring'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Triage Status</span>
                  <div className="mt-1">
                    <StatusBadge type="caseStatus" value={selectedCase.status} />
                  </div>
                </div>
              </div>

              {/* Advisory Clinical Guidelines */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                  Advisory Protocol Interventions
                </h4>

                <div className="space-y-3">
                  {selectedCase.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      id={`rec-card-${rec.id}`}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              Protocol {rec.ruleVersion}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                                rec.reviewStatus === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : rec.reviewStatus === 'dismissed'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {rec.reviewStatus}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 mt-1">{rec.proposedAction}</p>
                          <div className="text-[11px] text-slate-500">
                            <strong>Observed Triggers:</strong> {rec.triggerFacts.join('; ')}
                          </div>
                        </div>
                      </div>

                      {/* Review Buttons */}
                      {rec.reviewStatus === 'pending' && (
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <input
                            type="text"
                            placeholder="Clinical justification / action notes..."
                            value={recNotes[rec.id] || ''}
                            onChange={(e) => setRecNotes({ ...recNotes, [rec.id]: e.target.value })}
                            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 w-full sm:w-2/3 focus:ring-1 focus:ring-slate-900"
                          />
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              id={`btn-accept-rec-${rec.id}`}
                              onClick={() => handleReviewRec(rec.id, 'accepted')}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Authorize
                            </button>
                            <button
                              id={`btn-dismiss-rec-${rec.id}`}
                              onClick={() => handleReviewRec(rec.id, 'dismissed')}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Action History / Audit Events */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Chronological Follow-up Timeline
                </h4>
                <div className="space-y-2.5 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedCase.events.map((ev) => (
                    <div key={ev.id} className="text-xs relative pb-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-800">{ev.actorName}</span>
                        <span>{new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 mt-1 font-normal leading-relaxed">{ev.conciseNote}</p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                        Log Action: {ev.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/90 text-slate-400 text-xs">
              Select a case record to inspect dossier and record follow-ups.
            </div>
          )}

          {/* Section: Force Welfare SOP Reference */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                Health &amp; Welfare Directives Reference (Forces Medical Services)
              </h4>
            </div>

            <form onSubmit={handleSearchSOP} className="flex gap-2">
              <input
                id="input-sop-query"
                type="text"
                value={sopQuery}
                onChange={(e) => setSopQuery(e.target.value)}
                placeholder="Query rest regulations, night watch recovery protocols, or confidentiality directives..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
              <button
                id="btn-search-sop"
                type="submit"
                disabled={sopSearching}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs flex items-center shrink-0"
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                {sopSearching ? 'Searching...' : 'Search Directives'}
              </button>
            </form>

            {sopResult && (
              <div id="sop-answer-box" className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs space-y-2">
                <p className="text-slate-800 leading-relaxed">{sopResult.answer}</p>
                <div className="text-[11px] text-teal-700 font-mono pt-1">
                  Reference: {sopResult.sources.join('; ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Schedule Follow-up / Update Status */}
      {actionModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                Record Case Action • {selectedCase.personnelAlias}
              </h3>
              <button
                onClick={() => setActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Target Case Status
                </label>
                <select
                  id="select-case-status"
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as CaseStatus)}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900"
                >
                  <option value="acknowledged">Acknowledged (Reviewing data &amp; notes)</option>
                  <option value="follow_up_scheduled">Follow-up Scheduled (Appointment set)</option>
                  <option value="closed">Resolved / Case Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Follow-Up Scheduled Due Date
                </label>
                <input
                  id="input-case-due-at"
                  type="datetime-local"
                  value={actionDueAt.slice(0, 16)}
                  onChange={(e) => setActionDueAt(new Date(e.target.value).toISOString())}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Welfare Action Log Note (Confidential Permanent Dossier)
                </label>
                <textarea
                  id="textarea-action-note"
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Conducted 20-minute structured interview. Adjusted duty schedule to eliminate consecutive night shifts."
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-case-action"
                  type="submit"
                  disabled={actionSubmitting}
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
                >
                  {actionSubmitting ? 'Recording...' : 'Commit Case Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
