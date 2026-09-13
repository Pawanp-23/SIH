import React, { useState } from 'react';
import { UserRole } from '../../types.js';
import { api } from '../../api/client.js';
import {
  X,
  ShieldCheck,
  UserCheck,
  Heart,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string, role: UserRole) => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('personnel');
  const [unitName, setUnitName] = useState('102nd Mountain Battalion');
  const [rank, setRank] = useState('Constable');
  const [consentAcknowledged, setConsentAcknowledged] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleOptions: Array<{
    id: UserRole;
    title: string;
    description: string;
    icon: any;
    recommendedRank: string;
  }> = [
    {
      id: 'personnel',
      title: 'Service Member',
      description: 'Private 30-sec health & sleep reflection with Section 14 medical privilege.',
      icon: Heart,
      recommendedRank: 'Constable'
    },
    {
      id: 'welfare_officer',
      title: 'Welfare Officer',
      description: 'Triage high-strain alerts, review TreeSHAP factor breakdowns, and assign care.',
      icon: Activity,
      recommendedRank: 'Subedar'
    },
    {
      id: 'command_viewer',
      title: 'Brigade Commander',
      description: 'Monitor high-level battalion heatmaps and anonymized force readiness (k ≥ 10).',
      icon: Layers,
      recommendedRank: 'Colonel'
    }
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const selected = roleOptions.find((r) => r.id === newRole);
    if (selected) {
      setRank(selected.recommendedRank);
    }
  };

  const handleQuickDemo = (demoUserId: string, demoRole: UserRole) => {
    api.setUserId(demoUserId);
    onSuccess(demoUserId, demoRole);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your name to personalize your workspace.');
      return;
    }
    if (!consentAcknowledged) {
      setErrorMessage('Please acknowledge the Section 14 confidentiality safeguard.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.registerUser({
        name: fullName.trim(),
        role,
        unitName,
        rank
      });

      if (res.success && res.user) {
        onSuccess(res.user.id, res.user.role);
        onClose();
      } else {
        setErrorMessage('Failed to create user session. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 relative z-10 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Enter SAHARA Intelligence
              </h2>
              <p className="text-xs text-slate-500">
                Choose your role or create your personalized workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 py-4 space-y-5 relative z-10">
          {/* Quick Demo Shortcuts for instant access */}
          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick 1-Click Demo Profiles</span>
              <span className="text-[10px] text-orange-600 font-medium">Instant Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('p-014', 'personnel')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer text-xs"
              >
                <div className="font-bold text-slate-800 truncate">Rajesh V.</div>
                <div className="text-[10px] text-slate-500">Service Member</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('wo-kumar', 'welfare_officer')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer text-xs"
              >
                <div className="font-bold text-slate-800 truncate">Sub. Kumar</div>
                <div className="text-[10px] text-slate-500">Welfare Officer</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('cmd-singh', 'command_viewer')}
                className="p-2 text-left rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer text-xs"
              >
                <div className="font-bold text-slate-800 truncate">Col. Singh</div>
                <div className="text-[10px] text-slate-500">Brigade Cmd</div>
              </button>
            </div>
          </div>

          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-stone-200" />
            <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Or Customize Your Account
            </span>
            <div className="flex-1 border-t border-stone-200" />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="signup-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name or Callsign
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Captain Arvind Sen or Rajesh Verma"
                className="w-full text-xs rounded-xl border border-stone-200 bg-stone-50/80 p-2.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Select Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Your Operating Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleRoleChange(opt.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-slate-800 text-orange-400' : 'bg-stone-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{opt.title}</div>
                        <div
                          className={`text-[10px] mt-0.5 leading-relaxed line-clamp-2 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {opt.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit & Rank Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit / Battalion
                </label>
                <select
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 bg-stone-50/80 p-2.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900"
                >
                  <option value="102nd Mountain Battalion">102nd Mountain Battalion</option>
                  <option value="204th Strike Regiment">204th Strike Regiment</option>
                  <option value="501st Air Defense Wing">501st Air Defense Wing</option>
                  <option value="7th Reconnaissance Troop">7th Reconnaissance Troop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rank / Designation
                </label>
                <input
                  type="text"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-200 bg-stone-50/80 p-2.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Statutory Medical Privilege Consent */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAcknowledged}
                  onChange={(e) => setConsentAcknowledged(e.target.checked)}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 mt-0.5"
                />
                <div className="text-[11px] text-emerald-900 leading-relaxed">
                  <strong className="font-semibold block">Section 14 Medical Confidentiality</strong>
                  I acknowledge that welfare reports are used exclusively for supportive care and circadian rest scheduling, not military disciplinary assessment.
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Initializing Secure Workspace...</span>
                ) : (
                  <>
                    <span>Complete Sign-Up &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-orange-400" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
