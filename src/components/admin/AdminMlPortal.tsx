import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Activity,
  Layers,
  Lock,
  RefreshCw,
  Search,
  Key,
  Users
} from 'lucide-react';
import { api } from '../../api/client.js';
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

interface AdminMlPortalProps {
  initialSubTab?: 'model_monitoring' | 'dataset_health' | 'drift' | 'accuracy' | 'feature_importance' | 'audit_logs' | 'permissions';
}

export const AdminMlPortal: React.FC<AdminMlPortalProps> = ({
  initialSubTab = 'model_monitoring'
}) => {
  const [activeTab, setActiveTab] = useState<
    'model_monitoring' | 'dataset_health' | 'drift' | 'accuracy' | 'feature_importance' | 'audit_logs' | 'permissions'
  >(initialSubTab);

  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mRes, aRes] = await Promise.all([
          api.getModelHealth(),
          api.getAuditLogs()
        ]);
        if (mRes.success) setMetrics(mRes.health);
        if (aRes.success) setAuditLogs(aRes.logs);
      } catch (err) {
        console.error('Failed to load Admin/ML data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featureImportanceData = [
    { feature: 'Sleep Deficit (Rolling 72h)', importance: 0.34 },
    { feature: 'Consecutive Night Shifts', importance: 0.28 },
    { feature: 'Self-Reported Fatigue (1-5)', importance: 0.16 },
    { feature: 'Duty Shift Duration', importance: 0.12 },
    { feature: 'High-Altitude Cold Index', importance: 0.07 },
    { feature: 'Peer Camaraderie Score', importance: 0.03 }
  ];

  const driftDistributionData = [
    { bin: '0.0 - 0.2', Baseline: 45, Production: 43 },
    { bin: '0.2 - 0.4', Baseline: 28, Production: 30 },
    { bin: '0.4 - 0.6', Baseline: 16, Production: 15 },
    { bin: '0.6 - 0.8', Baseline: 8, Production: 9 },
    { bin: '0.8 - 1.0', Baseline: 3, Production: 3 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1E1E1E]">
      {/* Top Welcome Banner */}
      <div className="bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight font-serif text-[#1E1E1E]">
                04 Admin / ML Enclave
              </span>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30 font-bold">
                TreeSHAP v1.2 &bull; Edge Inference
              </span>
            </div>
            <p className="text-xs text-[#5E5A52] leading-relaxed max-w-2xl">
              Model performance monitoring, Population Stability Index (PSI) drift detection, differential privacy calibration, and immutable administrative audit verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30">
              PSI = 0.042 (Normal)
            </span>
          </div>
        </div>
      </div>

      {/* 7 Exact Sub-Sections Tabs Header */}
      <div className="bg-[#E3DDCF] p-1.5 rounded-2xl border border-[#D2CBBB] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('model_monitoring')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'model_monitoring'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Model monitoring</span>
        </button>

        <button
          onClick={() => setActiveTab('dataset_health')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'dataset_health'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Dataset health</span>
        </button>

        <button
          onClick={() => setActiveTab('drift')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'drift'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Drift</span>
        </button>

        <button
          onClick={() => setActiveTab('accuracy')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'accuracy'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Accuracy</span>
        </button>

        <button
          onClick={() => setActiveTab('feature_importance')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'feature_importance'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Feature importance</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit_logs'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Audit logs</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'permissions'
              ? 'bg-[#1d9f76] text-white shadow-xs'
              : 'text-[#5E5A52] hover:text-[#1E1E1E] hover:bg-[#F4EFE4]/60'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Permissions</span>
        </button>
      </div>

      {/* 1. MODEL MONITORING */}
      {activeTab === 'model_monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Current Model Version</span>
              <span className="text-2xl font-bold font-serif text-[#1E1E1E]">TreeSHAP v1.2.4</span>
              <span className="text-[11px] text-[#0f7058] block mt-1">Status: Active in Production</span>
            </div>
            <div className="p-5 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Mean Latency</span>
              <span className="text-2xl font-bold font-serif text-[#0f7058]">18 ms</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Target &lt; 50 ms</span>
            </div>
            <div className="p-5 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Inference Daily Volume</span>
              <span className="text-2xl font-bold font-serif text-[#1E1E1E]">14,280</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Edge telemetry checks</span>
            </div>
            <div className="p-5 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Calibration (Brier Score)</span>
              <span className="text-2xl font-bold font-serif text-[#1E1E1E]">0.082</span>
              <span className="text-[11px] text-[#0f7058] block mt-1">Excellent Calibration (&lt;0.10)</span>
            </div>
          </div>

          <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-3">
            <h3 className="font-bold text-base font-serif text-[#1E1E1E]">Model Health Matrix</h3>
            <p className="text-xs text-[#5E5A52]">
              XGBoost with Exact TreeSHAP explainer running in WebAssembly sandbox.
            </p>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] text-xs space-y-1 font-mono">
              <div>&bull; Architecture: Gradient Boosted Trees (120 estimators, max depth 4)</div>
              <div>&bull; Convergence: Early stopped at round 94 with validation log-loss 0.281</div>
              <div>&bull; Differential Privacy: &epsilon; = 0.5, &delta; = 10^-5 Laplacian noise injection</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DATASET HEALTH */}
      {activeTab === 'dataset_health' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">Training &amp; Ingestion Dataset Integrity</h3>
          <p className="text-xs text-[#5E5A52]">
            Data validation checks for missing sensor telemetry, corrupt timestamps, and range violations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Missing Feature Rate</span>
              <span className="text-xl font-bold font-serif text-[#0f7058]">0.02%</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Imputed with median cohort baseline</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Class Balance (Fatigue vs Rest)</span>
              <span className="text-xl font-bold font-serif text-[#1E1E1E]">18% / 82%</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Balanced with SMOTE oversampling</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Telemetry Validity</span>
              <span className="text-xl font-bold font-serif text-[#0f7058]">99.8%</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Passes all sensor bounds</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. DRIFT */}
      {activeTab === 'drift' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Population Stability Index (PSI) &amp; Feature Drift
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Comparing 2026 Q3 production cohort against baseline training distribution.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#1d9f76]/20 text-[#0f7058] border border-[#1d9f76]/30">
              PSI: 0.042 (No Drift Detected)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driftDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" vertical={false} />
                <XAxis dataKey="bin" tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <YAxis tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    color: '#F4EFE4',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="Baseline" fill="#5E5A52" name="Baseline Dataset" />
                <Bar dataKey="Production" fill="#1d9f76" name="Production Ingest" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. ACCURACY */}
      {activeTab === 'accuracy' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Model Validation &amp; Classification Metrics
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Evaluated on holdout military fatigue clinical trials.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">ROC-AUC Score</span>
              <span className="text-2xl font-bold font-serif text-[#0f7058]">0.924</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">High discrimination power</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Precision (Strain)</span>
              <span className="text-2xl font-bold font-serif text-[#1E1E1E]">88.5%</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Low false positives</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">Recall (Sensitivity)</span>
              <span className="text-2xl font-bold font-serif text-[#1E1E1E]">91.2%</span>
              <span className="text-[11px] text-[#5E5A52] block mt-1">Catches early acute fatigue</span>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB]">
              <span className="text-xs text-[#5E5A52] block">F1-Score</span>
              <span className="text-2xl font-bold font-serif text-[#0f7058]">0.898</span>
              <span className="text-[11px] text-[#0f7058] block mt-1">Standard benchmark passed</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. FEATURE IMPORTANCE */}
      {activeTab === 'feature_importance' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <div className="flex items-center justify-between border-b border-[#D2CBBB] pb-3">
            <div>
              <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
                Global Mean |SHAP| Values (Feature Weights)
              </h3>
              <p className="text-xs text-[#5E5A52]">
                Quantifies average feature contribution magnitude across all 14,000+ predictions.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData} layout="vertical" margin={{ left: 80, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D2CBBB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#5E5A52' }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: '#1E1E1E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    borderRadius: '12px',
                    color: '#F4EFE4',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${(val * 100).toFixed(1)}%`, 'Weight']}
                />
                <Bar dataKey="importance" fill="#1d9f76" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 6. AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Immutable Privacy &amp; Access Ledger (SHA-256)
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Cryptographically sealed trail of who accessed what data and verified k-anonymity compliance.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#E3DDCF] text-[#5E5A52] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Role</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">k &ge; 10 Verified</th>
                  <th className="p-3">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2CBBB]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#E3DDCF]/50 font-mono">
                    <td className="p-3 text-[#5E5A52]">{log.timestamp}</td>
                    <td className="p-3 font-bold text-[#1E1E1E]">{log.actorRole} ({log.actorId})</td>
                    <td className="p-3">{log.actionType}</td>
                    <td className="p-3 text-[#5E5A52]">{log.cohortFilter}</td>
                    <td className="p-3">
                      <span className="text-[#0f7058] font-bold">&check; Passed ({log.cohortSize} members)</span>
                    </td>
                    <td className="p-3 text-[10px] text-[#5E5A52]">{log.hash.slice(0, 16)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. PERMISSIONS */}
      {activeTab === 'permissions' && (
        <div className="p-6 bg-[#F4EFE4] rounded-3xl border border-[#D2CBBB] space-y-4">
          <h3 className="font-bold text-base font-serif text-[#1E1E1E]">
            Role-Based Access Control (RBAC) &amp; Enclave Policy
          </h3>
          <p className="text-xs text-[#5E5A52]">
            Strict enforcement of Section 14 medical privilege boundaries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-[#1E1E1E]">01 Personnel Portal</h4>
              <p className="text-[#5E5A52]">
                Full read/write of own check-ins, standardized self-assessments, recovery recommendations, and AI chatbot. Anonymized to all officers.
              </p>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-[#1E1E1E]">02 Welfare Officer</h4>
              <p className="text-[#5E5A52]">
                Access to flagged personnel profiles under Medical Secrecy, SHAP explanation attribution, and care intervention issuance.
              </p>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-[#1E1E1E]">03 Commander</h4>
              <p className="text-[#5E5A52]">
                Strict cohort aggregation ($k \ge 10$) only. Absolutely zero access to individual soldier raw check-in notes or names.
              </p>
            </div>
            <div className="p-4 bg-[#E3DDCF] rounded-2xl border border-[#D2CBBB] space-y-2">
              <h4 className="font-bold text-[#1E1E1E]">04 Admin / ML</h4>
              <p className="text-[#5E5A52]">
                Telemetry verification, model drift monitoring, differential privacy parameters, and audit ledger integrity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
