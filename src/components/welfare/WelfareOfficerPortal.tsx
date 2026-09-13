import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  RefreshCw,
  Info,
  BookOpen,
  FileText,
  Sliders,
  Check,
  XCircle,
  Clock,
  Sparkles,
  Search,
  UserCheck,
  Stethoscope,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { api } from '../../api/client.js';
import { StatusBadge } from '../common/StatusBadge.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine
} from 'recharts';

interface WelfareOfficerPortalProps {
  initialSubTab?: 'risk_overview' | 'alerts' | 'profile' | 'risk_history' | 'shap' | 'recommendations' | 'interventions';
  onOpenTacticalReset?: () => void;
}

export const WelfareOfficerPortal: React.FC<WelfareOfficerPortalProps> = ({
  initialSubTab = 'risk_overview',
  onOpenTacticalReset
}) => {
  const [activeTab, setActiveTab] = useState<
    'risk_overview' | 'alerts' | 'profile' | 'risk_history' | 'shap' | 'recommendations' | 'interventions'
  >(initialSubTab);

  const [loading, setLoading] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('p-014');
  const [personnelProfile, setPersonnelProfile] = useState<any>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('int-001');
  const [officerNote, setOfficerNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // RAG query state
  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, intRes] = await Promise.all([
        api.getPersonnelRiskProfile(selectedPersonnelId),
        api.getInterventions()
      ]);
      if (profileRes.success) {
        setPersonnelProfile(profileRes.profile);
      }
      if (intRes.success) {
        setInterventions(intRes.interventions);
      }
    } catch (err) {
      console.error('Failed to load welfare officer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPersonnelId]);

  const handleAction = async (id: string, action: 'approve' | 'dismiss' | 'complete') => {
    try {
      const res = await api.updateInterventionAction(id, action, officerNote);
      if (res.success) {
        setActionSuccess(`Intervention ${action.toUpperCase()} successfully.`);
        setTimeout(() => setActionSuccess(null), 3000);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleRagSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    try {
      const res = await api.getEvidenceGroundedGuidance(ragQuery);
      if (res.success) {
        setRagAnswer(res.result.answer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRagLoading(false);
    }
  };

  const selectedIntervention = interventions.find((i) => i.id === selectedInterventionId) || interventions[0];

  const alertsList = [
    {
      id: 'alt-1',
      token: 'Token #8412 (Const. R. Verma)',
      unit: '102nd Mountain Bn',
      risk: 78,
      factor: 'Circadian Desynchrony: 3 back-to-back night shifts + 4.2h sleep deficit',
      due: 'Immediate Action Required',
      level: 'Critical'
    },
    {
      id: 'alt-2',
      token: 'Token #3901 (Hav. D. Negi)',
      unit: '3rd Field Engineers',
      risk: 69,
      factor: 'Acute Physical Strain: 14h heavy logistics duty at 11,500 ft elevation',
      due: 'Within 6 Hours',
      level: 'High'
    },
    {
      id: 'alt-3',
      token: 'Token #5524 (Nk. P. Rawat)',
      unit: '14th Rajput Rifles',
      risk: 64,
      factor: 'Continuous 18-day forward patrol duty without scheduled rotation rest',
      due: 'Within 24 Hours',
      level: 'Watch'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1E1E1E]">
      {/* Top Welcome Banner */}
      <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight font-serif text-[#1E1E1E]">
                02 Welfare Officer Portal
              </span>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                Clinical Welfare Triage
              </span>
            </div>
            <p className="text-xs text-[#5E5A52] leading-relaxed max-w-2xl">
              Confidential personnel risk triage, TreeSHAP feature attributions, and evidence-grounded SOP 4.2 care intervention management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/30">
              3 High-Velocity Alerts
            </span>
          </div>
        </div>
      </div>

      {/* 7 Exact Sub-Sections Tabs Header */}
      <div className="bg-[#E3DDCF] p-1.5 rounded-2xl border border-[#D2CBBB] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('risk_overview')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'risk_overview'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Risk overview</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Personnel profile</span>
        </button>

        <button
          onClick={() => setActiveTab('risk_history')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'risk_history'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Risk history</span>
        </button>

        <button
          onClick={() => setActiveTab('shap')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'shap'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>SHAP explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recommendations'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Recommendations</span>
        </button>

        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'interventions'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Interventions</span>
        </button>
      </div>

      {/* 1. RISK OVERVIEW */}
      {activeTab === 'risk_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Monitored Service Members</span>
              <span className="text-3xl font-extrabold font-serif text-[#1E1E1E]">1,842</span>
              <p className="text-[11px] text-[#0f7058] mt-1">Full 102nd Battalion &amp; Attached Cohorts</p>
            </div>
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">High Operational Strain (&gt;65)</span>
              <span className="text-3xl font-extrabold font-serif text-rose-700">92</span>
              <p className="text-[11px] text-rose-800 mt-1">Immediate medical review warranted</p>
            </div>
            <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-5 shadow-sm">
              <span className="text-xs text-[#5E5A52] block">Active Care Interventions</span>
              <span className="text-3xl font-extrabold font-serif text-[#0f7058]">14</span>
              <p className="text-[11px] text-[#0f7058] mt-1">Rest authorizations &amp; sleep pacing in progress</p>
            </div>
          </div>

          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base font-serif text-[#1E1E1E]">Battalion Triage Board</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#E3DDCF] text-[#5E5A52] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Pseudonym Token</th>
                    <th className="p-3">Unit Cohort</th>
                    <th className="p-3">Welfare Index</th>
                    <th className="p-3">Primary SHAP Driver</th>
                    <th className="p-3">Review Band</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2CBBB]">
                  {alertsList.map((row) => (
                    <tr key={row.id} className="hover:bg-[#E3DDCF]/50">
                      <td className="p-3 font-bold font-mono text-[#1E1E1E]">{row.token}</td>
                      <td className="p-3 text-[#5E5A52]">{row.unit}</td>
                      <td className="p-3 font-mono font-bold text-rose-700">{row.risk} / 100</td>
                      <td className="p-3 text-[#5E5A52] max-w-xs">{row.factor}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-800 border border-rose-500/30">
                          {row.level}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedPersonnelId('p-014');
                            setActiveTab('profile');
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#1d9f76] text-white font-bold hover:bg-[#0f7058] transition-colors cursor-pointer"
                        >
                          Review Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
              High-Velocity Strain Alerts
            </h3>
            <p className="text-xs text-[#5E5A52]">
              Triggered automatically when sleep deficit &gt; 12 hours or acute consecutive night duties occur.
            </p>

            <div className="space-y-3">
              {alertsList.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#1E1E1E] font-mono">{alt.token}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-800 border border-rose-500/30 font-bold">
                        Risk {alt.risk}
                      </span>
                      <span className="text-xs text-[#5E5A52]">&bull; {alt.unit}</span>
                    </div>
                    <p className="text-xs text-[#5E5A52]">{alt.factor}</p>
                    <div className="text-[11px] font-mono text-[#0f7058]">SOP Action Window: {alt.due}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedPersonnelId('p-014');
                        setActiveTab('shap');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] text-xs font-bold border border-[#D2CBBB] cursor-pointer"
                    >
                      View SHAP
                    </button>
                    <button
                      onClick={() => setActiveTab('interventions')}
                      className="px-3.5 py-1.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold cursor-pointer"
                    >
                      Issue Rest Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PERSONNEL PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Personnel Profile: {personnelProfile?.pseudonymToken || 'Token #8412'}
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Unit: {personnelProfile?.unitName || '102nd Mountain Battalion'} &bull; Rank: Const. (GD)
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-800 border border-rose-500/30">
              Risk Score: {personnelProfile?.welfareRiskIndex || 78} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Current Deployment Sector</span>
              <span className="text-sm font-bold text-[#1E1E1E]">Sector 4 North (High Altitude)</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">11,800 ft &bull; Snow &amp; Sub-Zero Conditions</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Shift Rotation Pattern</span>
              <span className="text-sm font-bold text-rose-700">3 Consecutive Night Sentries</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">4.2h daily sleep debt accumulated</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Statutory Clearance</span>
              <span className="text-sm font-bold text-[#0f7058]">Section 14 Consented</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Medical confidentiality certified</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. RISK HISTORY */}
      {activeTab === 'risk_history' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Longitudinal Strain Trajectory (30-Day Velocity)
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Tracking risk elevation spikes coinciding with night patrol rotations.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0f7058] bg-[#1d9f76]/15 px-3 py-1 rounded-full border border-[#1d9f76]/30">
              TreeSHAP Velocity Model
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={personnelProfile?.temporalTrajectory || []}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    color: '#F4EFE4',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine y={65} stroke="#e11d48" strokeDasharray="4 4" label="Review Threshold (65)" />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#1d9f76"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1d9f76' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. SHAP EXPLANATION */}
      {activeTab === 'shap' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                TreeSHAP Feature Attribution &amp; Mathematical Accountability
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Explaining risk score of 78 relative to battalion baseline (42.0).
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1E1E1E] bg-[#E3DDCF] px-3 py-1 rounded-full border border-[#D2CBBB]">
              Base Value: 42.0
            </span>
          </div>

          <div className="space-y-3">
            {[
              { feature: '3 Consecutive Night Shifts', impact: '+18.5', category: 'Circadian Strain', color: 'bg-rose-500' },
              { feature: 'Sleep Deficit of 3.2 hrs below baseline', impact: '+11.2', category: 'Sleep Debt', color: 'bg-rose-500' },
              { feature: 'Extreme High Altitude Cold Exposure', impact: '+7.4', category: 'Environmental', color: 'bg-rose-500' },
              { feature: 'Active Peer Camaraderie Check-in', impact: '-4.8', category: 'Protective Buffer', color: 'bg-emerald-500' }
            ].map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#E3DDCF] border border-[#D2CBBB] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#1E1E1E]">{factor.feature}</div>
                  <div className="text-[10px] text-[#5E5A52]">{factor.category}</div>
                </div>
                <span
                  className={`font-mono font-bold text-xs px-2.5 py-1 rounded-full text-white ${factor.color}`}
                >
                  {factor.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Clinical Evidence-Based SOP Recommendations
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Algorithmic recommendations grounded in WHO Military Fatigue Standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="text-xs font-bold text-[#1E1E1E] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1d9f76]" />
                <span>Primary Recommendation: 48h Shift Downregulation</span>
              </h4>
              <p className="text-xs text-[#5E5A52]">
                Rotate out of midnight sentry duties into day administrative or supply checks to allow 2 full REM sleep cycles.
              </p>
              <div className="text-[11px] font-mono text-[#0f7058]">Projected Risk Reduction: -24 pts</div>
            </div>

            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="text-xs font-bold text-[#1E1E1E] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1d9f76]" />
                <span>Secondary Recommendation: Doctor Tele-Consultation</span>
              </h4>
              <p className="text-xs text-[#5E5A52]">
                Schedule an encrypted video consult with Capt. (Dr.) Ananya Sen to evaluate high-altitude sleep fragmentation.
              </p>
              <div className="text-[11px] font-mono text-[#0f7058]">Confidential AMC Protocol</div>
            </div>
          </div>
        </div>
      )}

      {/* 7. INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Active Case Management &amp; Care Authorizations
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Execute non-punitive rest authorizations and clinical care orders.
              </p>
            </div>
            {actionSuccess && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                {actionSuccess}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {interventions.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#1E1E1E]">{item.title}</h4>
                    <p className="text-xs text-[#5E5A52]">
                      Target: {item.targetPersonnelToken} &bull; Unit: {item.targetUnitName}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-[#5E5A52] leading-relaxed">{item.ragEvidenceQuote}</p>

                <div className="pt-2 border-t border-[#D2CBBB] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#0f7058] font-bold">
                    Projected Risk Drop: -{item.projectedRiskReduction} pts
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      className="px-4 py-1.5 rounded-full bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold cursor-pointer"
                    >
                      Authorize Rest
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-full bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#5E5A52] text-xs font-medium border border-[#D2CBBB] cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
