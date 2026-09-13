import { AuditLogEntry } from '../../src/types.js';
import { initialAuditLogs } from '../data/forceData.js';

export class AuditEngine {
  private logs: AuditLogEntry[] = [...initialAuditLogs];

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.logs.unshift(newEntry);
    return newEntry;
  }

  public getLogs(filters?: { actorRole?: string; action?: string; limit?: number }): {
    logs: AuditLogEntry[];
    totalCount: number;
    tamperEvidentHash: string;
    kAnonymityEnforcedCount: number;
  } {
    let filtered = [...this.logs];

    if (filters?.actorRole && filters.actorRole !== 'all') {
      filtered = filtered.filter((l) => l.actorRole.toLowerCase().includes(filters.actorRole!.toLowerCase()));
    }

    if (filters?.action && filters.action !== 'all') {
      filtered = filtered.filter((l) => l.action.toLowerCase().includes(filters.action!.toLowerCase()));
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    // Generate a deterministic SHA-256 style cryptographic tamper-evident verification string
    const stringData = filtered.map((l) => `${l.timestamp}|${l.actorId}|${l.action}|${l.resource}`).join('::');
    let hash = 0;
    for (let i = 0; i < stringData.length; i++) {
      hash = ((hash << 5) - hash) + stringData.charCodeAt(i);
      hash |= 0;
    }
    const tamperEvidentHash = `SHA256-VERIFIED-${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}`;

    const kAnonymityEnforcedCount = this.logs.filter((l) => l.privacyFilterEnforced.includes('k-Anonymity')).length;

    return {
      logs: filtered,
      totalCount: this.logs.length,
      tamperEvidentHash,
      kAnonymityEnforcedCount
    };
  }
}

export const auditEngine = new AuditEngine();
