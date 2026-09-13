import {
  UserProfile,
  DailyCheckinInput,
  AssessmentResult,
  WelfareCase,
  RecommendationCard
} from '../../src/types.js';
import { calculateHeuristicIndex } from '../engines/heuristicEngine.js';
import { predictNextDayStress } from '../engines/forecastEngine.js';

export interface DatabaseState {
  users: UserProfile[];
  checkins: Array<DailyCheckinInput & { id: string; userId: string; createdAt: string }>;
  assessments: AssessmentResult[];
  cases: WelfareCase[];
  auditLogs: Array<{ id: string; actor: string; action: string; target: string; timestamp: string }>;
}

export function getInitialSeedState(): DatabaseState {
  const users: UserProfile[] = [
    // --- KEY DEMO PERSONAS ---
    {
      id: 'p-014',
      name: 'Rajesh Verma',
      alias: 'P-014 (Constable)',
      role: 'personnel',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Constable',
      assignedOfficerId: 'wo-kumar',
      hasConsented: true,
      consentGrantedAt: '2026-08-01T08:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'p-008',
      name: 'Amit Sharma',
      alias: 'P-008 (Lance Naik)',
      role: 'personnel',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Lance Naik',
      assignedOfficerId: 'wo-kumar',
      hasConsented: true,
      consentGrantedAt: '2026-08-05T09:00:00Z'
    },
    {
      id: 'p-022',
      name: 'Manoj Rao',
      alias: 'P-022 (Havildar)',
      role: 'personnel',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Havildar',
      assignedOfficerId: 'wo-kumar',
      hasConsented: true,
      consentGrantedAt: '2026-08-10T10:00:00Z'
    },
    {
      id: 'p-005',
      name: 'Vikram Patil',
      alias: 'P-005 (Naik)',
      role: 'personnel',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Naik',
      assignedOfficerId: 'wo-kumar',
      hasConsented: true,
      consentGrantedAt: '2026-08-12T07:30:00Z'
    },
    // --- WELFARE OFFICER ---
    {
      id: 'wo-kumar',
      name: 'Arjun Kumar',
      alias: 'WO-Kumar (Welfare Officer)',
      role: 'welfare_officer',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Subedar (Welfare Wing)',
      hasConsented: true
    },
    // --- COMMAND VIEWER ---
    {
      id: 'cmd-singh',
      name: 'Harpreet Singh',
      alias: 'Col. Singh (Command)',
      role: 'command_viewer',
      unitId: 'unit-102',
      unitName: 'Sector CommandHQ',
      rank: 'Colonel',
      hasConsented: true
    }
  ];

  // Populate cohort 102 up to 15 members
  for (let i = 1; i <= 11; i++) {
    const numStr = (i + 15).toString().padStart(3, '0');
    users.push({
      id: `p-${numStr}`,
      name: `Personnel ${numStr}`,
      alias: `P-${numStr}`,
      role: 'personnel',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      rank: 'Rifleman',
      assignedOfficerId: 'wo-kumar',
      hasConsented: true,
      consentGrantedAt: '2026-08-15T06:00:00Z'
    });
  }

  // Populate cohort 204 with 15 members
  for (let i = 1; i <= 15; i++) {
    const numStr = (i + 100).toString().padStart(3, '0');
    users.push({
      id: `p-${numStr}`,
      name: `Personnel ${numStr}`,
      alias: `P-${numStr}`,
      role: 'personnel',
      unitId: 'unit-204',
      unitName: '204th Strike Regiment',
      rank: 'Gunner',
      hasConsented: true,
      consentGrantedAt: '2026-08-15T06:00:00Z'
    });
  }

  // Populate small cohort (Detachment Alpha) with only 4 members to test K-Anonymity privacy suppression!
  for (let i = 1; i <= 4; i++) {
    const numStr = (i + 300).toString().padStart(3, '0');
    users.push({
      id: `p-${numStr}`,
      name: `Specialist ${numStr}`,
      alias: `P-${numStr}`,
      role: 'personnel',
      unitId: 'unit-099',
      unitName: 'Detachment Alpha (Small Outpost)',
      rank: 'Specialist',
      hasConsented: true
    });
  }

  // Pre-seed check-ins and assessments
  const checkins: DatabaseState['checkins'] = [];
  const assessments: AssessmentResult[] = [];

  // P-014 7-day progression (showing rising strain over last 4 days)
  const p014History = [
    { date: '2026-09-06', sleep: 7.5, stress: 2, fatigue: 2, duty: 8, night: false, req: false },
    { date: '2026-09-07', sleep: 7.0, stress: 2, fatigue: 2, duty: 8, night: false, req: false },
    { date: '2026-09-08', sleep: 6.5, stress: 3, fatigue: 3, duty: 10, night: false, req: false },
    { date: '2026-09-09', sleep: 5.5, stress: 3, fatigue: 4, duty: 12, night: true, req: false },
    { date: '2026-09-10', sleep: 4.5, stress: 4, fatigue: 4, duty: 14, night: true, req: false }, // index ~67
    { date: '2026-09-11', sleep: 4.0, stress: 4, fatigue: 5, duty: 13, night: true, req: false }  // index ~74 (2nd consecutive Review day!)
  ];

  p014History.forEach((day, idx) => {
    const chkId = `chk-p014-${day.date}`;
    checkins.push({
      id: chkId,
      userId: 'p-014',
      date: day.date,
      sleepHours: day.sleep,
      perceivedStress: day.stress,
      perceivedFatigue: day.fatigue,
      dutyHours: day.duty,
      nightShift: day.night,
      supportRequested: day.req,
      createdAt: `${day.date}T06:30:00Z`
    });

    const heuristic = calculateHeuristicIndex(day.stress, day.fatigue, day.sleep, day.duty, 7.2);
    const forecast = predictNextDayStress({
      currentStress: day.stress,
      prevStress: idx > 0 ? p014History[idx - 1].stress : day.stress,
      currentFatigue: day.fatigue,
      sleepHours: day.sleep,
      dutyHours: day.duty,
      consecutiveNightShifts: day.night ? 2 : 0
    });

    assessments.push({
      id: `asm-p014-${day.date}`,
      checkinId: chkId,
      date: day.date,
      index: heuristic.index,
      band: heuristic.band,
      coverage: heuristic.coverage,
      contributors: heuristic.contributors,
      algorithmVersion: '1.2.0-deterministic',
      forecastValue: forecast.predictedStress,
      forecastBaseline: forecast.persistenceBaseline,
      modelVersion: forecast.modelVersion,
      generatedAt: `${day.date}T06:31:00Z`,
      dataSource: 'synthetic_demo'
    });
  });

  // P-008 stable history
  for (let d = 6; d <= 11; d++) {
    const dateStr = `2026-09-${d.toString().padStart(2, '0')}`;
    const chkId = `chk-p008-${dateStr}`;
    checkins.push({
      id: chkId,
      userId: 'p-008',
      date: dateStr,
      sleepHours: 7.5,
      perceivedStress: 2,
      perceivedFatigue: 2,
      dutyHours: 8,
      nightShift: false,
      supportRequested: false,
      createdAt: `${dateStr}T06:15:00Z`
    });
    const heuristic = calculateHeuristicIndex(2, 2, 7.5, 8, 7.5);
    assessments.push({
      id: `asm-p008-${dateStr}`,
      checkinId: chkId,
      date: dateStr,
      index: heuristic.index,
      band: heuristic.band,
      coverage: heuristic.coverage,
      contributors: heuristic.contributors,
      algorithmVersion: '1.2.0-deterministic',
      modelVersion: '1.0.4-synthetic',
      generatedAt: `${dateStr}T06:16:00Z`,
      dataSource: 'synthetic_demo'
    });
  }

  // Active Welfare Cases
  const cases: WelfareCase[] = [
    {
      id: 'case-p014',
      personnelId: 'p-014',
      personnelAlias: 'P-014 (Constable)',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      assignedOfficerId: 'wo-kumar',
      status: 'acknowledged',
      reason: 'Sustained Review Band (Score 74/100, 2 consecutive days)',
      dueAt: '2026-09-13T14:00:00Z',
      createdAt: '2026-09-11T07:00:00Z',
      updatedAt: '2026-09-11T09:30:00Z',
      latestIndex: 74,
      latestBand: 'review',
      consecutiveAlertDays: 2,
      supportRequested: false,
      events: [
        {
          id: 'ev-1',
          caseId: 'case-p014',
          actorId: 'system',
          actorName: 'SAHARA Watch Engine',
          action: 'AUTOMATIC_CASE_CREATION',
          conciseNote: 'Triggered after second consecutive daily check-in with score >= 65.',
          timestamp: '2026-09-11T07:00:00Z'
        },
        {
          id: 'ev-2',
          caseId: 'case-p014',
          actorId: 'wo-kumar',
          actorName: 'Subedar Arjun Kumar',
          action: 'CASE_ACKNOWLEDGED',
          conciseNote: 'Case acknowledged. Verified high duty rotation over past 4 days.',
          timestamp: '2026-09-11T09:30:00Z'
        }
      ],
      recommendations: [
        {
          id: 'rec-1',
          caseId: 'case-p014',
          triggerFacts: ['3 consecutive shifts >12 hours', 'Sleep deficit >3h vs baseline'],
          ruleVersion: 'R-WORKLOAD-01',
          proposedAction: 'Coordinate with company roster planner to provide 24h rest recovery opportunity.',
          reviewStatus: 'pending'
        },
        {
          id: 'rec-2',
          caseId: 'case-p014',
          triggerFacts: ['Self-reported fatigue level 5/5', 'Perceived stress 4/5'],
          ruleVersion: 'R-WELFARE-02',
          proposedAction: 'Initiate confidential welfare conversation regarding current fatigue burden.',
          reviewStatus: 'pending'
        }
      ]
    },
    {
      id: 'case-p022',
      personnelId: 'p-022',
      personnelAlias: 'P-022 (Havildar)',
      unitId: 'unit-102',
      unitName: '102nd Mountain Battalion',
      assignedOfficerId: 'wo-kumar',
      status: 'new',
      reason: 'Direct Personnel Support Request Initiated',
      dueAt: '2026-09-12T18:00:00Z',
      createdAt: '2026-09-12T05:00:00Z',
      updatedAt: '2026-09-12T05:00:00Z',
      latestIndex: 58,
      latestBand: 'watch',
      consecutiveAlertDays: 1,
      supportRequested: true,
      events: [
        {
          id: 'ev-3',
          caseId: 'case-p022',
          actorId: 'p-022',
          actorName: 'Havildar Manoj Rao',
          action: 'SUPPORT_REQUEST_SUBMITTED',
          conciseNote: 'Personnel flagged request for confidential conversation with welfare officer.',
          timestamp: '2026-09-12T05:00:00Z'
        }
      ],
      recommendations: [
        {
          id: 'rec-3',
          caseId: 'case-p022',
          triggerFacts: ['Explicit support request checkbox checked'],
          ruleVersion: 'R-DIRECT-01',
          proposedAction: 'Schedule confidential in-person or telephony welfare interview.',
          reviewStatus: 'pending'
        }
      ]
    }
  ];

  const auditLogs = [
    {
      id: 'aud-1',
      actor: 'p-014',
      action: 'CONSENT_GRANTED',
      target: 'welfare_sharing_v1.0',
      timestamp: '2026-08-01T08:00:00Z'
    },
    {
      id: 'aud-2',
      actor: 'wo-kumar',
      action: 'CASE_ACCESS',
      target: 'case-p014',
      timestamp: '2026-09-11T09:30:00Z'
    }
  ];

  return { users, checkins, assessments, cases, auditLogs };
}
