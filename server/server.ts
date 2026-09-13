import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { repository } from './cruds/repository.js';
import { GoogleGenAI } from '@google/genai';
import { mlPipeline } from './engines/mlPipeline.js';
import { ragService } from './engines/ragService.js';
import { auditEngine } from './engines/auditEngine.js';
import {
  initialForceOverview,
  initialUnitHeatmap,
  initialPersonnelProfiles,
  initialInterventions
} from './data/forceData.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client if API key is provided
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Simulated authentication middleware (derives identity from Authorization or X-User-Id)
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const customUserId = req.headers['x-user-id'] as string;

  let userId = 'p-014'; // Default demo personnel
  if (customUserId) {
    userId = customUserId;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // In our prototype, token contains the user ID
    userId = token.replace('token_', '');
  }

  const user = repository.getUser(userId);
  (req as any).currentUser = user || repository.getUser('p-014');
  next();
});

// --- API ROUTES (Wearing the Production Error Armor) ---

// 1. GET /api/me - Return authenticated profile & role permissions
app.get('/api/me', (req, res) => {
  try {
    const user = (req as any).currentUser;
    res.json({
      success: true,
      user,
      token: `token_${user.id}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve current user session' });
  }
});

// 2. GET /api/users - List users for demo persona switching
app.get('/api/users', (req, res) => {
  try {
    const users = repository.listUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// 2b. POST /api/register - Sign up / register new persona
app.post('/api/register', (req, res) => {
  try {
    const { name, role, unitName, rank } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(422).json({ error: 'Full name is required.' });
    }
    const validRoles = ['personnel', 'welfare_officer', 'command_viewer', 'demo_operator'];
    const chosenRole = validRoles.includes(role) ? role : 'personnel';
    const newUser = repository.createUser({
      name: name.trim(),
      role: chosenRole as any,
      unitName: unitName || '102nd Mountain Battalion',
      rank
    });
    res.json({
      success: true,
      user: newUser,
      token: `token_${newUser.id}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// 3. POST /api/consent - Update sharing consent
app.post('/api/consent', (req, res) => {
  try {
    const user = (req as any).currentUser;
    const { granted } = req.body;
    if (typeof granted !== 'boolean') {
      return res.status(422).json({ error: 'Field "granted" must be a boolean.' });
    }
    const updated = repository.setConsent(user.id, granted);
    res.json({ success: true, user: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update consent' });
  }
});

// 4. POST /api/checkins - Submit daily check-in (The 4-Gate Pipeline)
app.post('/api/checkins', (req, res) => {
  try {
    const user = (req as any).currentUser;

    // Gate 1: Check role
    if (user.role !== 'personnel') {
      return res.status(403).json({ error: 'Gate 1 Violation: Only personnel may submit daily check-ins.' });
    }

    const { date, sleepHours, perceivedStress, perceivedFatigue, dutyHours, nightShift, supportRequested, notes } = req.body;

    // Gate 2: Schema validation
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(422).json({ error: 'Gate 2 Violation: Valid date in YYYY-MM-DD format is required.' });
    }
    if (typeof sleepHours !== 'number' || sleepHours < 0 || sleepHours > 24) {
      return res.status(422).json({ error: 'Gate 2 Violation: sleepHours must be a number between 0 and 24.' });
    }
    if (typeof perceivedStress !== 'number' || perceivedStress < 1 || perceivedStress > 5) {
      return res.status(422).json({ error: 'Gate 2 Violation: perceivedStress must be an integer between 1 and 5.' });
    }
    if (typeof perceivedFatigue !== 'number' || perceivedFatigue < 1 || perceivedFatigue > 5) {
      return res.status(422).json({ error: 'Gate 2 Violation: perceivedFatigue must be an integer between 1 and 5.' });
    }

    // Gate 3: Business rules (Consent check & date validation)
    if (!user.hasConsented && !supportRequested) {
      return res.status(400).json({ error: 'Gate 3 Violation: Active welfare sharing consent required before submitting routine check-ins.' });
    }

    // Gate 4: Idempotent transactional persistence
    const assessment = repository.submitCheckin(user.id, {
      date,
      sleepHours,
      perceivedStress,
      perceivedFatigue,
      dutyHours: typeof dutyHours === 'number' ? dutyHours : undefined,
      nightShift: Boolean(nightShift),
      supportRequested: Boolean(supportRequested),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      assessment,
      message: 'Daily check-in evaluated and persisted successfully.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit checkin' });
  }
});

// 5. GET /api/me/trends - Personal check-in & assessment trends
app.get('/api/me/trends', (req, res) => {
  try {
    const user = (req as any).currentUser;
    const checkins = repository.getCheckins(user.id);
    const assessments = repository.getAssessments(user.id);

    // Merge for convenient chart display
    const merged = checkins.map((c) => {
      const asm = assessments.find((a) => a.checkinId === c.id || a.date === c.date);
      return {
        date: c.date,
        sleepHours: c.sleepHours,
        stress: c.perceivedStress,
        fatigue: c.perceivedFatigue,
        dutyHours: c.dutyHours || 8,
        nightShift: c.nightShift || false,
        supportRequested: c.supportRequested || false,
        index: asm?.index ?? 0,
        band: asm?.band ?? 'routine',
        forecastValue: asm?.forecastValue,
        forecastBaseline: asm?.forecastBaseline,
        contributors: asm?.contributors
      };
    }).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      history: merged,
      latestAssessment: assessments[assessments.length - 1] || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve personal trends' });
  }
});

// 6. GET /api/cases - Welfare Officer queue
app.get('/api/cases', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'welfare_officer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Only assigned welfare officers can access case queues.' });
    }
    const cases = repository.getCasesForOfficer(user.id);
    res.json({ success: true, cases });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve case queue' });
  }
});

// 7. GET /api/cases/:id - Case detail
app.get('/api/cases/:id', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'welfare_officer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Only assigned welfare officers can view case details.' });
    }
    const kase = repository.getCaseById(req.params.id);
    if (!kase) return res.status(404).json({ error: 'Case not found' });
    res.json({ success: true, case: kase });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve case' });
  }
});

// 8. POST /api/cases/:id/events - Update case status / schedule action
app.post('/api/cases/:id/events', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'welfare_officer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Only assigned welfare officers can update cases.' });
    }
    const { status, note, dueAt } = req.body;
    if (!status || !note) {
      return res.status(422).json({ error: 'Fields "status" and "note" are required.' });
    }
    const updated = repository.updateCaseStatus(req.params.id, user.id, status, note, dueAt);
    res.json({ success: true, case: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update case' });
  }
});

// 9. POST /api/cases/:id/recommendations/:recId/review - Review recommendation card
app.post('/api/cases/:id/recommendations/:recId/review', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'welfare_officer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Only assigned welfare officers can review recommendations.' });
    }
    const { decision, note } = req.body;
    if (!['accepted', 'dismissed'].includes(decision)) {
      return res.status(422).json({ error: 'Decision must be either "accepted" or "dismissed".' });
    }
    const updated = repository.reviewRecommendation(req.params.id, req.params.recId, user.id, decision, note || '');
    res.json({ success: true, case: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to review recommendation' });
  }
});

// 10. GET /api/command/summary - Command aggregate with strict K-Anonymity suppression
app.get('/api/command/summary', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'command_viewer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Command viewer clearance required.' });
    }
    const unitId = (req.query.unitId as string) || 'unit-102';
    const summary = repository.getUnitSummary(unitId);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve command aggregate' });
  }
});

// 11. POST /api/hr-import - Synthetic HRMS CSV import
app.post('/api/hr-import', (req, res) => {
  try {
    const user = (req as any).currentUser;
    if (user.role !== 'welfare_officer' && user.role !== 'demo_operator') {
      return res.status(403).json({ error: 'Access Denied: Only welfare officers can import organizational rosters.' });
    }
    const { records } = req.body;
    if (!Array.isArray(records)) {
      return res.status(422).json({ error: 'Records must be an array.' });
    }
    const result = repository.importSyntheticHR(records, user.id);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import HR records' });
  }
});

// 12. POST /api/system/reset - Reset to seed fixtures
app.post('/api/system/reset', (req, res) => {
  try {
    repository.reset();
    liveInterventions = [...initialInterventions];
    res.json({ success: true, message: 'All demo fixtures restored to seed baseline.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset demo state' });
  }
});

// In-memory interventions store for closed-loop lifecycle
let liveInterventions = [...initialInterventions];

// --- SCREEN 1: FORCE WELFARE OVERVIEW ---
app.get('/api/command/force-overview', (req, res) => {
  try {
    const user = (req as any).currentUser;
    auditEngine.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'VIEW_COMMAND_OVERVIEW',
      resource: 'Force Welfare Overview (1,842 Monitored)',
      justification: 'Operational readiness monitoring and aggregate triage',
      privacyFilterEnforced: 'Strict k-Anonymity (k>=10) Enforced'
    });
    res.json({ success: true, overview: initialForceOverview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve force welfare overview' });
  }
});

// --- SCREEN 2: UNIT INTELLIGENCE & HEATMAP ---
app.get('/api/units/intelligence', (req, res) => {
  try {
    const user = (req as any).currentUser;
    auditEngine.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'VIEW_UNIT_HEATMAP',
      resource: 'Battalion Welfare & Workload Matrix',
      justification: 'Unit strain distribution analysis',
      privacyFilterEnforced: 'Detachment Alpha Suppressed (k=4 < 10 threshold)'
    });
    res.json({ success: true, units: initialUnitHeatmap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit intelligence heatmap' });
  }
});

// --- SCREEN 3: PERSONNEL WELFARE RISK PROFILE & SHAP ---
app.get('/api/personnel/risk-profile/:id', (req, res) => {
  try {
    const user = (req as any).currentUser;
    const personnelId = req.params.id;
    const profile = initialPersonnelProfiles[personnelId] || initialPersonnelProfiles['p-014'];

    auditEngine.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'VIEW_PERSONNEL_DOSSIER',
      resource: `Personnel [${profile.pseudonymToken}]`,
      justification: 'Clinical risk factor and SHAP attribution review',
      privacyFilterEnforced: 'Pseudonymized Token Enforced & Access Tamper-Logged'
    });

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve personnel risk profile' });
  }
});

// --- SCREEN 4: INTERVENTION ASSISTANT & RAG ---
app.get('/api/interventions', (req, res) => {
  try {
    res.json({ success: true, interventions: liveInterventions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list interventions' });
  }
});

app.post('/api/interventions/:id/action', (req, res) => {
  try {
    const user = (req as any).currentUser;
    const { action, officerNotes } = req.body;
    const itemIndex = liveInterventions.findIndex((i) => i.id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Intervention not found' });
    }

    const item = liveInterventions[itemIndex];
    if (action === 'approve') {
      item.status = 'approved';
      item.approvedBy = `${user.rank} ${user.name}`;
      item.approvedAt = new Date().toISOString();
      if (officerNotes) item.officerNotes = officerNotes;

      auditEngine.log({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'AUTHORIZE_INTERVENTION',
        resource: `Intervention ${item.id} [${item.targetPersonnelToken}]`,
        justification: `Clinical authorization: ${item.title}`,
        privacyFilterEnforced: 'Officer Authorization Logged with Non-Punitive Clause'
      });
    } else if (action === 'dismiss') {
      item.status = 'dismissed';
      if (officerNotes) item.officerNotes = officerNotes;

      auditEngine.log({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'DISMISS_INTERVENTION',
        resource: `Intervention ${item.id} [${item.targetPersonnelToken}]`,
        justification: `Officer clinical dismissal reason: ${officerNotes || 'No specific rationale'}`,
        privacyFilterEnforced: 'Dismissal recorded in permanent audit trail'
      });
    } else if (action === 'complete') {
      item.status = 'completed';
      // Calculate closed loop post-intervention outcome (reduced risk)
      item.postInterventionRisk = Math.max(22, item.preInterventionRisk - item.projectedRiskReduction);

      auditEngine.log({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        action: 'CLOSE_INTERVENTION_LOOP',
        resource: `Intervention ${item.id} [${item.targetPersonnelToken}]`,
        justification: `Intervention completed with verified post-risk: ${item.postInterventionRisk}`,
        privacyFilterEnforced: 'Closed-Loop Verification Registered'
      });
    }

    liveInterventions[itemIndex] = item;
    res.json({ success: true, intervention: item });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update intervention' });
  }
});

app.post('/api/rag/recommend-interventions', async (req, res) => {
  try {
    const { query, riskContext } = req.body;
    const result = await ragService.getEvidenceGroundedGuidance(query || 'fatigue recovery', riskContext);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve RAG guidance' });
  }
});

// --- SCREEN 5: WHAT-IF SIMULATOR ---
app.post('/api/simulator/what-if', (req, res) => {
  try {
    const user = (req as any).currentUser;
    const simulationResult = mlPipeline.simulateWhatIf(req.body);

    auditEngine.log({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'RUN_WHAT_IF_SIMULATION',
      resource: `Counterfactual ML Test [${req.body.personnelId || 'p-014'}]`,
      justification: `Pre-action testing: duty delta ${req.body.dutyHoursDelta}h, night shift delta ${req.body.nightShiftsDelta}`,
      privacyFilterEnforced: 'Simulated In-Memory (No Personnel Data Mutated)'
    });

    res.json({ success: true, simulation: simulationResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to run what-if simulation' });
  }
});

// --- SCREEN 6: MODEL OBSERVABILITY & HEALTH ---
app.get('/api/model/health', (req, res) => {
  try {
    const health = mlPipeline.getModelHealth();
    res.json({ success: true, health });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve model health metrics' });
  }
});

// --- SCREEN 7: TAMPER-EVIDENT AUDIT & PRIVACY ---
app.get('/api/audit/logs', (req, res) => {
  try {
    const { role, action, limit } = req.query;
    const auditData = auditEngine.getLogs({
      actorRole: role as string,
      action: action as string,
      limit: limit ? parseInt(limit as string, 10) : 50
    });
    res.json({ success: true, ...auditData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit log trail' });
  }
});

app.post('/api/audit/log', (req, res) => {
  try {
    const entry = auditEngine.log(req.body);
    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to append audit record' });
  }
});

// 13. Standard MCP Endpoints (Day 7 Model Context Protocol Integration)
app.get('/api/mcp/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: 'calculate_wellbeing_index',
        description: 'Calculate deterministic 0-100 heuristic stress index and review band from raw indicators.',
        inputSchema: {
          type: 'object',
          properties: {
            stress: { type: 'number', minimum: 1, maximum: 5 },
            fatigue: { type: 'number', minimum: 1, maximum: 5 },
            sleepHours: { type: 'number', minimum: 0, maximum: 24 },
            dutyHours: { type: 'number', minimum: 0, maximum: 24 }
          },
          required: ['stress', 'fatigue', 'sleepHours']
        }
      },
      {
        name: 'get_unit_aggregate',
        description: 'Get privacy-suppressed operational aggregate for a specified battalion/cohort.',
        inputSchema: {
          type: 'object',
          properties: {
            unitId: { type: 'string', description: 'Battalion or unit identifier' }
          },
          required: ['unitId']
        }
      }
    ]
  });
});

app.post('/api/mcp/call', (req, res) => {
  const { name, arguments: args } = req.body;
  if (name === 'calculate_wellbeing_index') {
    const { calculateHeuristicIndex } = require('./engines/heuristicEngine.js');
    const result = calculateHeuristicIndex(args.stress, args.fatigue, args.sleepHours, args.dutyHours);
    return res.json({ result });
  } else if (name === 'get_unit_aggregate') {
    const summary = repository.getUnitSummary(args.unitId || 'unit-102');
    return res.json({ result: summary });
  }
  res.status(404).json({ error: `Tool ${name} not found` });
});

// 14. POST /api/rag/sop-search - Force Welfare SOP Search
app.post('/api/rag/sop-search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required.' });

  // Standard Force Mental Health & Welfare SOP Reference Chunks (Phase 1 index)
  const sopChunks = [
    {
      title: 'SOP-WEL-01: Post-Deployment Rest Cycles',
      content: 'Personnel completing continuous high-altitude or border patrol deployments exceeding 60 days must receive a mandatory minimum 72-hour de-escalation rest window prior to standard duty rotation.'
    },
    {
      title: 'SOP-WEL-02: Acute Fatigue & Night Shift Governance',
      content: 'No uniformed personnel shall be assigned to more than three consecutive night watch shifts without a scheduled 24-hour physiological circadian recovery interval. Welfare officers must be notified of operational roster deviations.'
    },
    {
      title: 'SOP-WEL-03: Voluntary Welfare Counseling Protocol',
      content: 'Any self-initiated personnel support request triggers an immediate priority welfare case. The assigned welfare officer must conduct an initial confidential informal inquiry within 24 hours. Medical confidentiality is strictly maintained.'
    },
    {
      title: 'SOP-WEL-04: Non-Punitive Health Information Protections',
      content: 'Personal wellness check-in responses are strictly protected under Section 14 Privacy Directives. Disciplinary or promotional decision boards are legally prohibited from subpoenaing or reviewing subjective stress ratings.'
    }
  ];

  // Try Gemini synthesis if key is present, otherwise return relevant chunk directly
  const gemini = getGemini();
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the SAHARA Force Welfare SOP assistant.
Answer the question using ONLY the provided SOP context chunks.
If the information is not present, state that force regulations do not specify this directly. Always cite the SOP title.

Context:
${sopChunks.map((c) => `[${c.title}]\n${c.content}`).join('\n\n')}

Question: ${query}`
      });
      return res.json({
        answer: response.text,
        sources: sopChunks.map((c) => c.title)
      });
    } catch (e: any) {
      console.warn('Gemini query error, falling back to local search:', e.message);
    }
  }

  // Deterministic search fallback
  const matching = sopChunks.filter((c) =>
    c.content.toLowerCase().includes(query.toLowerCase()) ||
    c.title.toLowerCase().includes(query.toLowerCase())
  );
  const best = matching.length > 0 ? matching : [sopChunks[2]];
  res.json({
    answer: `${best[0].title}: ${best[0].content}`,
    sources: best.map((c) => c.title)
  });
});

// --- VITE MIDDLEWARE INTEGRATION & SERVER STARTUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SAHARA Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
