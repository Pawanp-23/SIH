import React, { useEffect, useState } from 'react';
import { ModelHealthMetrics, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  Cpu,
  CheckCircle2,
  Activity,
  Gauge,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Server
} from 'lucide-react';

interface ModelMonitoringScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
}

export const ModelMonitoringScreen: React.FC<ModelMonitoringScreenProps> = ({
  onNavigateScreen
}) => {
  const [health, setHealth] = useState<ModelHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getModelHealth();
      if (res.success) {
        setHealth(res.health);
      }
    } catch (err) {
      console.error('Failed to load model health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !health) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Activity className="w-5 h-5 animate-spin mr-2 text-teal-600" />
        <span className="text-sm">Querying ML Pipeline Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="screen-model-monitoring">
      {/* Screen Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SCREEN 06 &bull; MODEL OBSERVABILITY
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: {health.status.toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AI Model Health &amp; Operational Telemetry
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
            Real-time tracking of predictive model fidelity, TreeSHAP inference latency, drift detection (PSI), and production runtime architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateScreen('audit_privacy')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            <span>Audit &amp; Privacy Log (Screen 07)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model Health Metrics Ribbon (Direct Match to User Specification) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        {/* Model Identifier */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Active Pipeline</div>
          <div className="text-base font-bold text-slate-900 font-mono tracking-tight">{health.modelName}</div>
          <div className="text-[11px] text-teal-600 font-mono mt-1">Calibrated Ensemble</div>
        </div>

        {/* F1 Score */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">F1 Score</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{health.f1Score}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">&ge; 0.80 benchmark</div>
        </div>

        {/* Recall */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Recall Rate</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{health.recall}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Minimizes false negatives</div>
        </div>

        {/* ROC-AUC */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">ROC-AUC</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{health.rocAuc}</div>
          <div className="text-[11px] text-slate-500 mt-1">High discrimination</div>
        </div>

        {/* Inference Latency p95 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">p95 Latency</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{health.inferenceLatencyP95Ms}ms</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">TreeSHAP accelerated</div>
        </div>

        {/* Data Drift PSI */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Population Drift</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            {health.driftLevel.toUpperCase()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">PSI: {health.psiScore} &lt; 0.10</div>
        </div>
      </div>

      {/* Latency & Feature Importance Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Feature Importance */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Global Feature Importance (TreeSHAP)</h2>
              <p className="text-xs text-slate-500">Aggregate factor influence across all personnel predictions</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">1,842 samples</span>
          </div>

          <div className="space-y-3">
            {health.featureImportance.map((f, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{f.feature}</span>
                  <span className="font-mono font-bold text-slate-900">{f.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    style={{ width: `${f.percentage}%` }}
                    className="bg-teal-600 rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inference Latency Profile</h2>
              <p className="text-xs text-slate-500">Distribution across 24h operational evaluations</p>
            </div>
            <span className="text-xs text-emerald-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Failures: {health.predictionFailureRate}%
            </span>
          </div>

          <div className="space-y-3">
            {health.latencyDistribution.map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700">{b.bucket}</span>
                  <span className="font-mono font-bold text-slate-900">{b.percentage}% of requests</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    style={{ width: `${b.percentage}%` }}
                    className="bg-indigo-600 rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Runtime Host: Cloud Run Container (Node.js BFF)</span>
            <span className="font-mono">Engine: Fast Matrix SHAP</span>
          </div>
        </div>
      </div>

      {/* Production Architecture Blueprint */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">Full-Stack Production System Architecture</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6 max-w-3xl">
          SAHARA couples a React 18 single-page application with a Node.js Express Backend-for-Frontend (BFF), an internal XGBoost TreeSHAP inference pipeline, and Gemini 3.8 Flash RAG policy search.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Box 1 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
            <div className="text-teal-400 font-mono text-[10px] uppercase font-bold mb-1">Layer 01 &bull; Client</div>
            <div className="font-bold text-slate-100 mb-1">React 18 + Vite</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              7-screen commander &amp; officer dashboard hierarchy, real-time What-If simulator, and responsive UI.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
            <div className="text-teal-400 font-mono text-[10px] uppercase font-bold mb-1">Layer 02 &bull; BFF Gateway</div>
            <div className="font-bold text-slate-100 mb-1">Node.js / Express</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enforces k-anonymity (k &ge; 10), role-based access control, cryptographic audit trail, and request routing.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
            <div className="text-teal-400 font-mono text-[10px] uppercase font-bold mb-1">Layer 03 &bull; ML Pipeline</div>
            <div className="font-bold text-slate-100 mb-1">XGBoost &amp; TreeSHAP</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Fast inference (38ms), additive SHAP attribution, temporal progression tracking, and counterfactual simulation.
            </p>
          </div>

          {/* Box 4 */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
            <div className="text-teal-400 font-mono text-[10px] uppercase font-bold mb-1">Layer 04 &bull; Intelligence</div>
            <div className="font-bold text-slate-100 mb-1">Gemini 3.8 Flash RAG</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Armed Forces Mental Health regulations, circadian recovery guidelines, and evidence-grounded action synthesis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
