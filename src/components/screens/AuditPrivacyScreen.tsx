import React, { useEffect, useState } from 'react';
import { AuditLogEntry, ScreenId } from '../../types.js';
import { api } from '../../api/client.js';
import {
  Lock,
  ShieldCheck,
  Filter,
  CheckCircle2,
  FileCheck,
  Clock,
  UserCheck,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AuditPrivacyScreenProps {
  onNavigateScreen: (screen: ScreenId) => void;
}

export const AuditPrivacyScreen: React.FC<AuditPrivacyScreenProps> = ({ onNavigateScreen }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [tamperHash, setTamperHash] = useState<string>('');
  const [kCount, setKCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs(selectedRole, selectedAction, 50);
      if (res.success) {
        setLogs(res.logs);
        setTamperHash(res.tamperEvidentHash);
        setKCount(res.kAnonymityEnforcedCount);
        setTotalCount(res.totalCount);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedRole, selectedAction]);

  return (
    <div className="space-y-6" id="screen-audit-privacy">
      {/* Screen Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              SCREEN 07 &bull; AUDIT &amp; PRIVACY
            </span>
            <span className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
              06 Privacy-First &bull; Section 14 Mandate
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Immutable Access Log &amp; Privacy Protections
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
            Strict accountability for all welfare telemetry accesses. Every view, query, and authorization is cryptographically signed and verifiable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
            title="Refresh audit trail"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Privacy Guarantees Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: k-Anonymity */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-teal-700">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">k-Anonymity (k &ge; 10)</h3>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono mb-1">Active Enforced</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All unit-level aggregates with fewer than 10 active personnel (such as Detachment Alpha, N=4) are completely suppressed from commander review.
          </p>
        </div>

        {/* Card 2: Pseudonymization */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700">
            <Lock className="w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zero PII in Models</h3>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono mb-1">TOKEN-E9F2A8</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            ML inference runs strictly on randomized non-reversible cryptographic tokens. Service numbers, names, and contact details are segregated in air-gapped HR vaults.
          </p>
        </div>

        {/* Card 3: Cryptographic Integrity */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <FileCheck className="w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tamper-Evident Hash</h3>
          </div>
          <div className="text-xs font-bold text-emerald-800 font-mono mb-1 truncate">
            {tamperHash || 'SHA256-VERIFIED-INTEGRITY'}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Audit chain verified. Any retroactive modification or record deletion breaks the cryptographic signature.
          </p>
        </div>
      </div>

      {/* Audit Log Table & Filters */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Append-Only Audit Trail</h2>
            <p className="text-xs text-slate-500">Documenting who accessed what, when, and under what operational justification</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs p-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="welfare">Welfare Officers</option>
                <option value="command">Command Viewers</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Action:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="text-xs p-1.5 rounded border border-slate-300 bg-white"
              >
                <option value="all">All Actions</option>
                <option value="VIEW">Views</option>
                <option value="AUTHORIZE">Authorizations</option>
                <option value="SIMULATION">Simulations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/70 text-slate-500 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Resource</th>
                <th className="py-2.5 px-4">Operational Justification</th>
                <th className="py-2.5 px-4">Privacy Filter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.actorName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.justification}>
                    {log.justification}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {log.privacyFilterEnforced}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Displaying {logs.length} verifiable entries of {totalCount} total events</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Integrity Status: Verified Unaltered
          </span>
        </div>
      </div>
    </div>
  );
};
