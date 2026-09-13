import React from 'react';
import { ReviewBand, CaseStatus } from '../../types.js';

interface StatusBadgeProps {
  type: 'band' | 'caseStatus';
  value: ReviewBand | CaseStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'band') {
    switch (value) {
      case 'review':
        return (
          <span
            id={`badge-band-${value}`}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 tracking-normal ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5" />
            Review Required
          </span>
        );
      case 'watch':
        return (
          <span
            id={`badge-band-${value}`}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 tracking-normal ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Watch Trend
          </span>
        );
      case 'routine':
      default:
        return (
          <span
            id={`badge-band-${value}`}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 tracking-normal ${className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Routine
          </span>
        );
    }
  }

  // Case Status
  switch (value) {
    case 'new':
      return (
        <span
          id={`badge-case-${value}`}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}
        >
          New Triage
        </span>
      );
    case 'acknowledged':
      return (
        <span
          id={`badge-case-${value}`}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200/80 ${className}`}
        >
          Acknowledged
        </span>
      );
    case 'follow_up_scheduled':
      return (
        <span
          id={`badge-case-${value}`}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80 ${className}`}
        >
          Follow-up Set
        </span>
      );
    case 'closed':
      return (
        <span
          id={`badge-case-${value}`}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 ${className}`}
        >
          Resolved
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] text-slate-600 bg-slate-100 border border-slate-200/80 ${className}`}>
          {value}
        </span>
      );
  }
};
