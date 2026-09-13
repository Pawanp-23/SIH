import {
  UserProfile,
  DailyCheckinInput,
  AssessmentResult,
  WelfareCase,
  UnitAggregateSummary,
  CaseStatus,
  CaseEvent,
  SyntheticHRRecord
} from '../../src/types.js';
import { getInitialSeedState, DatabaseState } from '../data/seedData.js';
import { calculateHeuristicIndex } from '../engines/heuristicEngine.js';
import { predictNextDayStress } from '../engines/forecastEngine.js';
import { evaluateCohortSuppression } from '../engines/suppressionEngine.js';

class SaharaRepository {
  private state: DatabaseState;

  constructor() {
    this.state = getInitialSeedState();
  }

  public reset(): void {
    this.state = getInitialSeedState();
  }

  public getUser(userId: string): UserProfile | undefined {
    return this.state.users.find((u) => u.id.toLowerCase() === userId.toLowerCase());
  }

  public listUsers(): UserProfile[] {
    return this.state.users;
  }

  public createUser(userData: { name: string; role: 'personnel' | 'welfare_officer' | 'command_viewer' | 'demo_operator'; unitName?: string; rank?: string }): UserProfile {
    const id = `u-${Date.now().toString().slice(-5)}`;
    const defaultRank = userData.role === 'command_viewer' ? 'Colonel' : userData.role === 'welfare_officer' ? 'Subedar' : 'Constable';
    const newUser: UserProfile = {
      id,
      name: userData.name,
      alias: `${userData.name} (${userData.rank || defaultRank})`,
      role: userData.role,
      unitId: 'unit-102',
      unitName: userData.unitName || '102nd Mountain Battalion',
      rank: userData.rank || defaultRank,
      assignedOfficerId: userData.role === 'personnel' ? 'wo-kumar' : undefined,
      hasConsented: true,
      consentGrantedAt: new Date().toISOString()
    };
    this.state.users.unshift(newUser);
    this.logAudit(id, 'USER_REGISTERED', `role_${newUser.role}`);
    return newUser;
  }

  public setConsent(userId: string, granted: boolean): UserProfile {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');
    user.hasConsented = granted;
    user.consentGrantedAt = granted ? new Date().toISOString() : undefined;

    this.logAudit(userId, granted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN', `policy_v1.0`);
    return user;
  }

  public getCheckins(userId: string) {
    return this.state.checkins.filter((c) => c.userId.toLowerCase() === userId.toLowerCase());
  }

  public getAssessments(userId: string): AssessmentResult[] {
    const userCheckinIds = new Set(this.getCheckins(userId).map((c) => c.id));
    return this.state.assessments.filter((a) => userCheckinIds.has(a.checkinId));
  }

  public submitCheckin(userId: string, input: DailyCheckinInput): AssessmentResult {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');

    // Baseline calculation over previous 7 days
    const pastCheckins = this.getCheckins(userId);
    const validSleeps = pastCheckins.map((c) => c.sleepHours).filter((s) => typeof s === 'number');
    const avgSleep =
      validSleeps.length > 0
        ? validSleeps.reduce((a, b) => a + b, 0) / validSleeps.length
        : 7.0;

    // Gate 4: Check if already submitted for this date (Idempotent upsert)
    const existingCheckinIndex = this.state.checkins.findIndex(
      (c) => c.userId.toLowerCase() === userId.toLowerCase() && c.date === input.date
    );

    const checkinId = existingCheckinIndex >= 0
      ? this.state.checkins[existingCheckinIndex].id
      : `chk-${userId}-${input.date}`;

    const checkinRecord = {
      id: checkinId,
      userId,
      date: input.date,
      sleepHours: input.sleepHours,
      perceivedStress: input.perceivedStress,
      perceivedFatigue: input.perceivedFatigue,
      dutyHours: input.dutyHours,
      nightShift: input.nightShift,
      supportRequested: input.supportRequested,
      notes: input.notes,
      createdAt: new Date().toISOString()
    };

    if (existingCheckinIndex >= 0) {
      this.state.checkins[existingCheckinIndex] = checkinRecord;
    } else {
      this.state.checkins.push(checkinRecord);
    }

    // Run Heuristic Scoring
    const heuristic = calculateHeuristicIndex(
      input.perceivedStress,
      input.perceivedFatigue,
      input.sleepHours,
      input.dutyHours,
      avgSleep
    );

    // Run Experimental Forecast
    const prevStress = pastCheckins.length > 0 ? pastCheckins[pastCheckins.length - 1].perceivedStress : input.perceivedStress;
    const forecast = predictNextDayStress({
      currentStress: input.perceivedStress,
      prevStress,
      currentFatigue: input.perceivedFatigue,
      sleepHours: input.sleepHours,
      dutyHours: input.dutyHours,
      consecutiveNightShifts: input.nightShift ? 1 : 0
    });

    const assessment: AssessmentResult = {
      id: `asm-${userId}-${input.date}`,
      checkinId,
      date: input.date,
      index: heuristic.index,
      band: heuristic.band,
      coverage: heuristic.coverage,
      contributors: heuristic.contributors,
      algorithmVersion: '1.2.0-deterministic',
      forecastValue: forecast.predictedStress,
      forecastBaseline: forecast.persistenceBaseline,
      modelVersion: forecast.modelVersion,
      generatedAt: new Date().toISOString(),
      dataSource: 'live_input'
    };

    // Upsert assessment
    const existingAsmIdx = this.state.assessments.findIndex((a) => a.checkinId === checkinId);
    if (existingAsmIdx >= 0) {
      this.state.assessments[existingAsmIdx] = assessment;
    } else {
      this.state.assessments.push(assessment);
    }

    // Evaluate Case Creation Rules:
    // Rule A: Explicit support requested bypasses score!
    // Rule B: Two consecutive days with score >= 65 opens or updates case.
    const userAsms = this.getAssessments(userId).sort((a, b) => a.date.localeCompare(b.date));
    const recent2 = userAsms.slice(-2);
    const twoConsecutiveHigh = recent2.length >= 2 && recent2.every((a) => a.index >= 65);

    if (input.supportRequested || twoConsecutiveHigh) {
      this.upsertCase(userId, input.supportRequested ? 'DIRECT_REQUEST' : 'CONSECUTIVE_ELEVATED', heuristic.index);
    }

    this.logAudit(userId, 'CHECKIN_SUBMITTED', checkinId);
    return assessment;
  }

  private upsertCase(userId: string, triggerType: 'DIRECT_REQUEST' | 'CONSECUTIVE_ELEVATED', latestIndex: number): void {
    const user = this.getUser(userId);
    if (!user) return;

    let activeCase = this.state.cases.find(
      (c) => c.personnelId.toLowerCase() === userId.toLowerCase() && c.status !== 'closed'
    );

    const reason =
      triggerType === 'DIRECT_REQUEST'
        ? 'Direct Personnel Support Request Initiated'
        : `Sustained Review Band (Score ${latestIndex}/100, 2 consecutive days)`;

    if (!activeCase) {
      const caseId = `case-${userId}-${Date.now()}`;
      activeCase = {
        id: caseId,
        personnelId: userId,
        personnelAlias: user.alias,
        unitId: user.unitId,
        unitName: user.unitName,
        assignedOfficerId: user.assignedOfficerId || 'wo-kumar',
        status: 'new',
        reason,
        dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestIndex,
        latestBand: latestIndex >= 65 ? 'review' : 'watch',
        consecutiveAlertDays: triggerType === 'CONSECUTIVE_ELEVATED' ? 2 : 1,
        supportRequested: triggerType === 'DIRECT_REQUEST',
        events: [
          {
            id: `ev-${Date.now()}`,
            caseId,
            actorId: 'system',
            actorName: 'SAHARA Triaging Engine',
            action: 'CASE_OPENED',
            conciseNote: `Trigger: ${reason}`,
            timestamp: new Date().toISOString()
          }
        ],
        recommendations: [
          {
            id: `rec-${Date.now()}-1`,
            caseId,
            triggerFacts: [triggerType === 'DIRECT_REQUEST' ? 'Direct request flagged' : 'Index >= 65 recorded'],
            ruleVersion: 'R-WELFARE-01',
            proposedAction: 'Initiate confidential 1-on-1 welfare dialogue within 24 hours.',
            reviewStatus: 'pending'
          }
        ]
      };
      this.state.cases.unshift(activeCase);
    } else {
      activeCase.latestIndex = latestIndex;
      activeCase.latestBand = latestIndex >= 65 ? 'review' : 'watch';
      activeCase.updatedAt = new Date().toISOString();
      if (triggerType === 'DIRECT_REQUEST') {
        activeCase.supportRequested = true;
      }
      activeCase.events.push({
        id: `ev-${Date.now()}`,
        caseId: activeCase.id,
        actorId: 'system',
        actorName: 'SAHARA Triaging Engine',
        action: 'CASE_UPDATED',
        conciseNote: `Subsequent check-in processed. Current score: ${latestIndex}/100.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  public getCasesForOfficer(officerId: string): WelfareCase[] {
    return this.state.cases.filter((c) => c.assignedOfficerId.toLowerCase() === officerId.toLowerCase());
  }

  public getCaseById(caseId: string): WelfareCase | undefined {
    return this.state.cases.find((c) => c.id === caseId);
  }

  public updateCaseStatus(
    caseId: string,
    officerId: string,
    status: CaseStatus,
    conciseNote: string,
    newDueAt?: string
  ): WelfareCase {
    const kase = this.getCaseById(caseId);
    if (!kase) throw new Error('Case not found');
    const officer = this.getUser(officerId);

    kase.status = status;
    kase.updatedAt = new Date().toISOString();
    if (newDueAt) {
      kase.dueAt = newDueAt;
    }

    const event: CaseEvent = {
      id: `ev-${Date.now()}`,
      caseId,
      actorId: officerId,
      actorName: officer?.name || 'Welfare Officer',
      action: `STATUS_CHANGED_${status.toUpperCase()}`,
      conciseNote,
      timestamp: new Date().toISOString()
    };
    kase.events.push(event);

    this.logAudit(officerId, 'CASE_UPDATED', caseId);
    return kase;
  }

  public reviewRecommendation(
    caseId: string,
    recId: string,
    officerId: string,
    decision: 'accepted' | 'dismissed',
    reviewerNote: string
  ): WelfareCase {
    const kase = this.getCaseById(caseId);
    if (!kase) throw new Error('Case not found');

    const rec = kase.recommendations.find((r) => r.id === recId);
    if (!rec) throw new Error('Recommendation not found');

    rec.reviewStatus = decision;
    rec.reviewerId = officerId;
    rec.reviewerNote = reviewerNote;
    rec.reviewedAt = new Date().toISOString();

    kase.events.push({
      id: `ev-${Date.now()}`,
      caseId,
      actorId: officerId,
      actorName: this.getUser(officerId)?.name || 'Welfare Officer',
      action: `RECOMMENDATION_${decision.toUpperCase()}`,
      conciseNote: `${decision.toUpperCase()}: ${rec.proposedAction} (Note: ${reviewerNote})`,
      timestamp: new Date().toISOString()
    });

    return kase;
  }

  public getUnitSummary(unitId: string): UnitAggregateSummary {
    const unitPersonnel = this.state.users.filter((u) => u.unitId === unitId && u.role === 'personnel');
    const unitName = unitPersonnel[0]?.unitName || (unitId === 'unit-099' ? 'Detachment Alpha' : 'Unit');
    const count = unitPersonnel.length;

    // If suppressed (less than 10 personnel)
    if (count < 10) {
      return evaluateCohortSuppression(unitId, unitName, count, 0, [], 0, 0, 0, []);
    }

    // For authorized cohorts:
    const activeCheckins = this.state.checkins.filter((c) => {
      const u = this.getUser(c.userId);
      return u?.unitId === unitId;
    });

    const dutyHours = activeCheckins.map((c) => c.dutyHours || 8);
    const nightShiftCount = activeCheckins.filter((c) => c.nightShift).length;
    const openCases = this.state.cases.filter((c) => c.unitId === unitId && c.status !== 'closed').length;
    const resolvedCases = this.state.cases.filter((c) => c.unitId === unitId && c.status === 'closed').length;

    // 7-day trend
    const dates = ['2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12'];
    const rawTrends = dates.map((d) => {
      const dayChks = activeCheckins.filter((c) => c.date === d);
      return {
        date: d,
        dutyHours: dayChks.map((c) => c.dutyHours || 8),
        nightCount: dayChks.filter((c) => c.nightShift).length
      };
    });

    return evaluateCohortSuppression(
      unitId,
      unitName,
      count,
      Math.min(count, activeCheckins.length),
      dutyHours,
      nightShiftCount,
      openCases,
      resolvedCases,
      rawTrends
    );
  }

  public importSyntheticHR(records: SyntheticHRRecord[], officerId: string) {
    let flaggedCount = 0;
    const flaggedPersonnel: Array<{ personnelId: string; reason: string }> = [];

    records.forEach((rec) => {
      if (rec.dutyHours > 12 && rec.nightShift) {
        flaggedCount++;
        flaggedPersonnel.push({
          personnelId: rec.personnelId,
          reason: `High duty workload (${rec.dutyHours}h night shift, ${rec.daysSinceRest} days since rest).`
        });
      }
    });

    this.logAudit(officerId, 'HR_BATCH_IMPORTED', `imported_${records.length}_records`);

    return {
      totalImported: records.length,
      flaggedCount,
      flaggedPersonnel
    };
  }

  private logAudit(actor: string, action: string, target: string): void {
    this.state.auditLogs.unshift({
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor,
      action,
      target,
      timestamp: new Date().toISOString()
    });
  }

  public getAuditLogs() {
    return this.state.auditLogs;
  }
}

export const repository = new SaharaRepository();
