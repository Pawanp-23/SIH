import {
  UserProfile,
  DailyCheckinInput,
  AssessmentResult,
  WelfareCase,
  UnitAggregateSummary,
  CaseStatus,
  SyntheticHRRecord,
  ForceWelfareOverview,
  UnitHeatmapItem,
  PersonnelRiskProfile,
  InterventionItem,
  WhatIfSimulationInput,
  WhatIfSimulationResult,
  ModelHealthMetrics,
  AuditLogEntry
} from '../types.js';

class SaharaApiClient {
  private currentUserId: string = 'p-014';

  public setUserId(userId: string) {
    this.currentUserId = userId;
  }

  public getUserId(): string {
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-User-Id': this.currentUserId,
      'Authorization': `Bearer token_${this.currentUserId}`,
      ...(options.headers as Record<string, string> || {})
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  }

  public async getMe(): Promise<{ success: boolean; user: UserProfile; token: string }> {
    return this.request('/api/me');
  }

  public async listUsers(): Promise<{ success: boolean; users: UserProfile[] }> {
    return this.request('/api/users');
  }

  public async registerUser(data: {
    name: string;
    role: 'personnel' | 'welfare_officer' | 'command_viewer' | 'demo_operator';
    unitName?: string;
    rank?: string;
  }): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const res = await this.request<{ success: boolean; user: UserProfile; token: string }>('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.success && res.user) {
      this.currentUserId = res.user.id;
    }
    return res;
  }

  public async setConsent(granted: boolean): Promise<{ success: boolean; user: UserProfile }> {
    return this.request('/api/consent', {
      method: 'POST',
      body: JSON.stringify({ granted })
    });
  }

  public async submitCheckin(
    input: DailyCheckinInput
  ): Promise<{ success: boolean; assessment: AssessmentResult; message: string }> {
    return this.request('/api/checkins', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  public async getTrends(): Promise<{
    success: boolean;
    history: any[];
    latestAssessment: AssessmentResult | null;
  }> {
    return this.request('/api/me/trends');
  }

  public async getCases(): Promise<{ success: boolean; cases: WelfareCase[] }> {
    return this.request('/api/cases');
  }

  public async getCaseById(caseId: string): Promise<{ success: boolean; case: WelfareCase }> {
    return this.request(`/api/cases/${caseId}`);
  }

  public async updateCase(
    caseId: string,
    status: CaseStatus,
    note: string,
    dueAt?: string
  ): Promise<{ success: boolean; case: WelfareCase }> {
    return this.request(`/api/cases/${caseId}/events`, {
      method: 'POST',
      body: JSON.stringify({ status, note, dueAt })
    });
  }

  public async reviewRecommendation(
    caseId: string,
    recId: string,
    decision: 'accepted' | 'dismissed',
    note: string
  ): Promise<{ success: boolean; case: WelfareCase }> {
    return this.request(`/api/cases/${caseId}/recommendations/${recId}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, note })
    });
  }

  public async getCommandSummary(unitId: string): Promise<{ success: boolean; summary: UnitAggregateSummary }> {
    return this.request(`/api/command/summary?unitId=${encodeURIComponent(unitId)}`);
  }

  public async importHR(records: SyntheticHRRecord[]): Promise<{ success: boolean; result: any }> {
    return this.request('/api/hr-import', {
      method: 'POST',
      body: JSON.stringify({ records })
    });
  }

  public async resetSystem(): Promise<{ success: boolean; message: string }> {
    return this.request('/api/system/reset', {
      method: 'POST'
    });
  }

  public async searchSOP(query: string): Promise<{ answer: string; sources: string[] }> {
    return this.request('/api/rag/sop-search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  // --- SCREEN 1: FORCE WELFARE OVERVIEW ---
  public async getForceOverview(): Promise<{ success: boolean; overview: ForceWelfareOverview }> {
    return this.request('/api/command/force-overview');
  }

  // --- SCREEN 2: UNIT INTELLIGENCE & HEATMAP ---
  public async getUnitIntelligence(): Promise<{ success: boolean; units: UnitHeatmapItem[] }> {
    return this.request('/api/units/intelligence');
  }

  // --- SCREEN 3: PERSONNEL WELFARE RISK PROFILE & SHAP ---
  public async getPersonnelRiskProfile(personnelId: string): Promise<{ success: boolean; profile: PersonnelRiskProfile }> {
    return this.request(`/api/personnel/risk-profile/${encodeURIComponent(personnelId)}`);
  }

  // --- SCREEN 4: INTERVENTION ASSISTANT & RAG ---
  public async getInterventions(): Promise<{ success: boolean; interventions: InterventionItem[] }> {
    return this.request('/api/interventions');
  }

  public async updateInterventionAction(
    id: string,
    action: 'approve' | 'dismiss' | 'complete',
    officerNotes?: string
  ): Promise<{ success: boolean; intervention: InterventionItem }> {
    return this.request(`/api/interventions/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, officerNotes })
    });
  }

  public async getEvidenceGroundedGuidance(query: string, riskContext?: string): Promise<{
    success: boolean;
    result: {
      answer: string;
      citations: Array<{ code: string; title: string; legalBasis: string }>;
      recommendedInterventions: string[];
    };
  }> {
    return this.request('/api/rag/recommend-interventions', {
      method: 'POST',
      body: JSON.stringify({ query, riskContext })
    });
  }

  // --- SCREEN 5: WHAT-IF SIMULATOR ---
  public async runWhatIfSimulation(input: WhatIfSimulationInput): Promise<{
    success: boolean;
    simulation: WhatIfSimulationResult;
  }> {
    return this.request('/api/simulator/what-if', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  // --- SCREEN 6: MODEL OBSERVABILITY & HEALTH ---
  public async getModelHealth(): Promise<{ success: boolean; health: ModelHealthMetrics }> {
    return this.request('/api/model/health');
  }

  // --- SCREEN 7: TAMPER-EVIDENT AUDIT & PRIVACY ---
  public async getAuditLogs(role?: string, action?: string, limit?: number): Promise<{
    success: boolean;
    logs: AuditLogEntry[];
    totalCount: number;
    tamperEvidentHash: string;
    kAnonymityEnforcedCount: number;
  }> {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (action) params.set('action', action);
    if (limit) params.set('limit', limit.toString());
    return this.request(`/api/audit/logs?${params.toString()}`);
  }
}

export const api = new SaharaApiClient();
