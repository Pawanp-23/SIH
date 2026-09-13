import React, { useState } from 'react';
import { UserRole } from '../../types.js';
import {
  Shield,
  UserCheck,
  Stethoscope,
  ShieldAlert,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export interface LoginAccount {
  id: string;
  role: UserRole;
  rank: string;
  name: string;
  serviceNo: string;
  unit: string;
  tier: number;
  tierLabel: string;
  allowedPortalsCount: number;
  allowedPortals: string[];
  description: string;
  icon: typeof UserCheck;
  accentBorder: string;
  accentBg: string;
  badgeBg: string;
  badgeText: string;
}

export const LOGIN_ACCOUNTS: LoginAccount[] = [
  {
    id: 'p-014',
    role: 'personnel',
    rank: 'Constable',
    name: 'Rahul Verma',
    serviceNo: 'SM-102-4418',
    unit: '102nd Mountain Battalion (B Company)',
    tier: 1,
    tierLabel: 'Tier 1: Personal Records Only',
    allowedPortalsCount: 1,
    allowedPortals: ['01 Personnel Portal (Self)'],
    description: 'Confidential self check-in, longitudinal wellbeing tracking, PHQ/GAD screening, and direct support access.',
    icon: UserCheck,
    accentBorder: 'border-[#1d9f76]',
    accentBg: 'bg-[#1d9f76]/10',
    badgeBg: 'bg-[#1d9f76]/15',
    badgeText: 'text-[#0f7058]'
  },
  {
    id: 'wo-001',
    role: 'welfare_officer',
    rank: 'Captain (AMC)',
    name: 'Dr. Ananya Sen',
    serviceNo: 'AMC-882-7104',
    unit: '102nd Mountain Battalion (Medical Detachment)',
    tier: 2,
    tierLabel: 'Tier 2: Medical Welfare Clearance',
    allowedPortalsCount: 2,
    allowedPortals: ['01 Personnel Portal', '02 Welfare Officer Portal'],
    description: 'Battalion-level strain triage board, early warning indicators, explainable risk factors, and non-punitive rest orders.',
    icon: Stethoscope,
    accentBorder: 'border-[#efa02a]',
    accentBg: 'bg-[#efa02a]/10',
    badgeBg: 'bg-[#efa02a]/20',
    badgeText: 'text-amber-900'
  },
  {
    id: 'cmd-001',
    role: 'command_viewer',
    rank: 'Colonel',
    name: 'Vikram Rawat',
    serviceNo: 'INF-102-0012',
    unit: '102nd Mountain Battalion Headquarters',
    tier: 3,
    tierLabel: 'Tier 3: Tactical Command Clearance',
    allowedPortalsCount: 3,
    allowedPortals: ['01 Personnel Portal', '02 Welfare Officer Portal', '03 Commander Portal'],
    description: 'Aggregated battalion operational readiness (k ≥ 10 privacy threshold), high-altitude strain distribution, and readiness trends.',
    icon: ShieldAlert,
    accentBorder: 'border-[#0f7058]',
    accentBg: 'bg-[#0f7058]/10',
    badgeBg: 'bg-[#0f7058]/20',
    badgeText: 'text-[#0f7058]'
  },
  {
    id: 'adm-001',
    role: 'admin',
    rank: 'Major',
    name: 'S. Iyer',
    serviceNo: 'MED-SYS-9901',
    unit: 'Armed Forces Medical Informatics Wing',
    tier: 4,
    tierLabel: 'Tier 4: Full System Governance',
    allowedPortalsCount: 4,
    allowedPortals: ['01 Personnel Portal', '02 Welfare Officer Portal', '03 Commander Portal', '04 Admin / ML Portal'],
    description: 'Model calibration, feature drift (PSI), ROC-AUC accuracy validation, Section 14 audit ledger, and user permissions.',
    icon: Cpu,
    accentBorder: 'border-stone-600',
    accentBg: 'bg-stone-500/10',
    badgeBg: 'bg-stone-500/20',
    badgeText: 'text-stone-800'
  }
];

interface LoginPortalProps {
  onLoginSuccess: (role: UserRole, userId: string) => void;
  onOpenSystemOverview?: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  onOpenSystemOverview
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('p-014');
  const [serviceNumberInput, setServiceNumberInput] = useState<string>('SM-102-4418');
  const [pinInput, setPinInput] = useState<string>('••••••••');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const selectedAccount = LOGIN_ACCOUNTS.find((a) => a.id === selectedAccountId) || LOGIN_ACCOUNTS[0];

  const handleSelectCard = (account: LoginAccount) => {
    setSelectedAccountId(account.id);
    setServiceNumberInput(account.serviceNo);
    setPinInput('••••••••');
    setAuthError(null);
  };

  const executeLogin = (account: LoginAccount) => {
    setIsAuthenticating(true);
    setAuthError(null);

    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(account.role, account.id);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(selectedAccount);
  };

  return (
    <div className="min-h-screen bg-[#e9e4d8] text-[#1E1E1E] flex flex-col font-sans selection:bg-[#1d9f76] selection:text-white">
      {/* Official Security Header */}
      <header className="bg-[#E3DDCF] border-b border-[#D2CBBB] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1d9f76]/20 border border-[#1d9f76]/30 flex items-center justify-center text-[#0f7058] shadow-xs">
              <Shield className="w-5 h-5 text-[#0f7058]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-[#1E1E1E] font-serif">SAHARA</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F4EFE4] text-[#5E5A52] border border-[#D2CBBB] font-bold">
                  Official Use Only
                </span>
              </div>
              <p className="text-[11px] text-[#5E5A52] font-medium">
                Armed Forces Health &amp; Operational Readiness Information System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            {onOpenSystemOverview && (
              <button
                onClick={onOpenSystemOverview}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4EFE4] hover:bg-[#D2CBBB] text-[#1E1E1E] border border-[#D2CBBB] font-medium transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#5E5A52]" />
                <span>System Overview</span>
              </button>
            )}
            <div className="flex items-center space-x-1 text-[11px] text-[#0f7058] font-bold bg-[#F4EFE4] px-3 py-1.5 rounded-full border border-[#D2CBBB]">
              <Lock className="w-3 h-3 text-[#1d9f76]" />
              <span>Section 14 Medical Secrecy Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Viewport */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F4EFE4] border border-[#D2CBBB] text-xs font-semibold text-[#5E5A52]">
            <KeyRound className="w-3.5 h-3.5 text-[#1d9f76]" />
            <span>Secure Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] tracking-tight font-serif">
            Select Your Duty Echelon to Authenticate
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A52] leading-relaxed">
            Access to health records and command analytics is strictly segregated by operational role.
            Select your assigned account below to enter the verified workspace.
          </p>
        </div>

        {/* 4 Dedicated Login Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {LOGIN_ACCOUNTS.map((acc) => {
            const Icon = acc.icon;
            const isSelected = selectedAccountId === acc.id;

            return (
              <div
                key={acc.id}
                onClick={() => handleSelectCard(acc)}
                className={`rounded-2xl border-2 transition-all p-4 bg-[#F4EFE4] cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? `${acc.accentBorder} shadow-md ring-2 ring-offset-2 ring-[#1d9f76]/30`
                    : 'border-[#D2CBBB] hover:border-[#1d9f76]/60 hover:shadow-xs'
                }`}
              >
                {/* Top Badge: Clearance Tier */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${acc.badgeBg} ${acc.badgeText}`}>
                      Tier {acc.tier} Access
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] text-[#5E5A52] font-semibold">
                      <span>{acc.allowedPortalsCount} {acc.allowedPortalsCount === 1 ? 'Portal' : 'Portals'}</span>
                    </div>
                  </div>

                  {/* Persona Identity */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${acc.accentBg} flex items-center justify-center shrink-0 border border-[#D2CBBB]`}>
                      <Icon className="w-5 h-5 text-[#1E1E1E]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#1E1E1E] truncate">{acc.rank} {acc.name}</div>
                      <div className="text-[11px] font-mono text-[#5E5A52] truncate">{acc.serviceNo}</div>
                      <div className="text-[10px] text-[#0f7058] font-medium truncate mt-0.5">{acc.unit}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#5E5A52] leading-relaxed mb-3">
                    {acc.description}
                  </p>
                </div>

                {/* Authorized Portals Summary */}
                <div className="pt-3 border-t border-[#D2CBBB]/60 space-y-2">
                  <div className="text-[10px] font-mono uppercase font-bold text-[#5E5A52]">
                    Authorized Scope:
                  </div>
                  <ul className="space-y-1">
                    {acc.allowedPortals.map((portalName, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 text-[11px] text-[#1E1E1E] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1d9f76] shrink-0" />
                        <span className="truncate">{portalName}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Direct One-Click Sign In Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeLogin(acc);
                    }}
                    disabled={isAuthenticating}
                    className={`w-full mt-3 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs ${
                      isSelected
                        ? 'bg-[#1d9f76] hover:bg-[#0f7058] text-white'
                        : 'bg-[#E3DDCF] hover:bg-[#D2CBBB] text-[#1E1E1E]'
                    }`}
                  >
                    <span>{isSelected ? 'Authenticate & Enter' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Account Verification Card */}
        <div className="max-w-2xl mx-auto w-full bg-[#F4EFE4] border border-[#D2CBBB] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#D2CBBB] mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1d9f76] animate-pulse" />
              <span className="text-xs font-bold text-[#1E1E1E]">
                Active Verification Console &bull; {selectedAccount.tierLabel}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#5E5A52]">
              Security Clearance: {selectedAccount.allowedPortalsCount} of 4 Levels
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5E5A52] mb-1">
                  Service / Identification Number
                </label>
                <input
                  type="text"
                  value={serviceNumberInput}
                  onChange={(e) => setServiceNumberInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#E3DDCF] border border-[#D2CBBB] rounded-xl text-xs font-mono font-medium text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76]"
                  placeholder="e.g. SM-102-4418"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5E5A52] mb-1">
                  Official Security Access PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#E3DDCF] border border-[#D2CBBB] rounded-xl text-xs font-mono font-medium text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#1d9f76] pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E5A52] hover:text-[#1E1E1E] cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-[#5E5A52]">
                Signing in as: <strong className="text-[#1E1E1E]">{selectedAccount.rank} {selectedAccount.name}</strong> ({selectedAccount.unit})
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1d9f76] hover:bg-[#0f7058] text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Legal & Security Compliance Footer */}
        <div className="mt-8 text-center text-[11px] text-[#5E5A52] space-y-1">
          <p>
            This is an official defense healthcare network. Unauthorized access attempts are monitored and logged.
          </p>
          <p className="font-mono text-[10px]">
            Statutory Medical Secrecy: Section 14 Armed Forces Health Directives &bull; Cryptographic Ledger Sealed
          </p>
        </div>
      </main>
    </div>
  );
};
