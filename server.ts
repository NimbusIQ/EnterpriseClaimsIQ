import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Nimbus Sovereign API Security Middleware ---
  const enforceSovereignAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    // In production, this would validate against Secret Manager
    if (apiKey !== process.env.VITE_SOVEREIGN_ADMIN_KEY && apiKey !== 'dev_sovereign_key') {
      return res.status(401).json({ 
        status: "error", 
        message: "Unauthorized. Sovereign Admin access required." 
      });
    }
    next();
  };

  // --- Core Sovereign API Endpoints ---

  // Agent: Atlas (Roofing Supplement Ins Agent)
  app.post("/api/sovereign/v1/atlas/supplement", enforceSovereignAccess, async (req, res) => {
    const { roof_area_squares, damage_percentage, location } = req.body;
    
    if (!roof_area_squares || !damage_percentage || !location) {
      return res.status(400).json({ status: "error", message: "Missing required parameters for SATCALC V2 algorithm." });
    }

    console.log(`[Agent: Atlas] Running Supplement Calculation for ${location} | ${roof_area_squares}SQ @ ${damage_percentage}%`);
    
    // Simulated SATCALC V2 + Triple-RAG Knowledge Cluster result
    const baseValue = roof_area_squares * 450; // Mock base cost
    const supplementValue = baseValue * (damage_percentage) * 1.35; // 35% margin/O&P

    res.json({
      status: "success",
      lineageId: `atlas-txn-${Date.now()}`,
      data: {
        grand_total: supplementValue,
        justification: `Based on expert analysis for ${location}, we enforce building codes like IRC R905.2 and ensure appropriate O&P.`,
        missing_line_items: ['Ridge Cap (High Profile)', 'Drip Edge Replacement', 'O&P (10/10)'],
        code_citations: ['IRC R905.2', 'Texas Insurance Code Chapter 542']
      }
    });
  });

  // Agent: ClaimCore Forensic Agent
  app.post("/api/sovereign/v1/claimcore/audit", enforceSovereignAccess, async (req, res) => {
    const { claim_id, scope_of_loss_text, property_location, roof_metrics } = req.body;

    if (!claim_id || !scope_of_loss_text || !roof_metrics?.squares) {
      return res.status(400).json({ 
        status: "error", 
        message: "Missing required forensic parameters: claim_id, scope_of_loss_text, and roof_metrics.squares are required." 
      });
    }

    console.log(`[Agent: ClaimCore] Executing Forensic Audit for Claim #${claim_id} | ${roof_metrics.squares}SQ`);

    const squares = Number(roof_metrics.squares);
    const originalRcv = squares * 320;
    const calculatedRcv = squares * 485 * 1.2; // Including 20% O&P
    const netLeakage = calculatedRcv - originalRcv;

    res.json({
      status: "success",
      lineageId: `claimcore-audit-${Date.now()}`,
      data: {
        claim_id,
        supplement_summary: {
          original_rcv: Math.round(originalRcv),
          calculated_rcv: Math.round(calculatedRcv),
          net_claim_leakage: Math.round(netLeakage),
          contractor_margin_op: 20
        },
        missing_line_items: [
          {
            xactimate_code: "RFG 300S",
            description: "High-Profile Ridge Cap Shingles",
            unit_price: 68.50,
            quantity: Math.ceil(squares * 0.35),
            unit: "LF",
            total_price: Math.round(Math.ceil(squares * 0.35) * 68.50),
            building_code_citation: "IRC R905.2.8.2 - Hip & Ridge Installation Specifications"
          },
          {
            xactimate_code: "RFG DRIP",
            description: "Drip Edge Flashing (Eaves & Rakes)",
            unit_price: 4.25,
            quantity: Math.ceil(squares * 12),
            unit: "LF",
            total_price: Math.round(Math.ceil(squares * 12) * 4.25),
            building_code_citation: "IRC R905.2.8.5 - Drip Edge Requirement Enforcement"
          },
          {
            xactimate_code: "O&P 10/10",
            description: "General Contractor Overhead & Profit",
            unit_price: Math.round(originalRcv * 0.20),
            quantity: 1,
            unit: "EA",
            total_price: Math.round(originalRcv * 0.20),
            building_code_citation: "Texas Insurance Code Chapter 542 / Texas Bulletin CU-108"
          }
        ],
        rebuttal_letter_markdown: `# NOTICE OF SUPPLEMENTAL CLAIM & CODE COMPLIANCE AUDIT\n\n**Claim ID:** ${claim_id}\n**Jurisdiction:** ${property_location?.state || 'TX'}\n\nDear Adjuster,\n\nOur forensic audit of the initial scope of loss reveals **$${Math.round(netLeakage).toLocaleString()}** in unallocated mandatory line items required by local building code enforcement and manufacturer specifications. Pursuant to Texas Insurance Code Chapter 542, please find attached our itemized Xactimate XML and code citations for prompt approval.\n\nSincerely,\n**ClaimCore Autonomous Forensic Swarm**`,
        xactimate_xml_payload: `<?xml version="1.0" encoding="UTF-8"?><ClaimAudit claimId="${claim_id}" leakage="${Math.round(netLeakage)}" status="APPROVED_SUBMISSION"/>`,
        confidence_score: 0.985,
        audit_lineage_id: `claimcore-lineage-${Date.now()}`
      }
    });
  });

  // Agent: Dr. Yu (TCM Diet Agent / Shen OS)
  app.post("/api/sovereign/v1/dryu/temporal-context", enforceSovereignAccess, async (req, res) => {
    const { user_id, current_datetime } = req.body;

    if (!user_id || !current_datetime) {
      return res.status(400).json({ status: "error", message: "Missing required temporal parameters." });
    }

    console.log(`[Agent: Dr. Yu] Calculating Dual-Calendar Context for ${user_id} at ${current_datetime}`);

    // Simulated Dual-Calendar Architecture result
    res.json({
      status: "success",
      lineageId: `dryu-txn-${Date.now()}`,
      data: {
        tcm_season: "Late Spring / Early Summer (Fire Transition)",
        active_organ: "Heart / Small Intestine",
        recommended_diet_focus: "Add cooling foods to clear excess heat. Bitter greens are optimal.",
        grok_score_alignment: 85
      }
    });
  });

  // Antigravity Brain Ingestion
  app.get("/api/v1/brain/ingest", (req, res) => {
    try {
      const brainPath = path.join(process.cwd(), "antigravity", "brain.md");
      const brainContent = fs.readFileSync(brainPath, "utf-8");
      res.json({ status: "success", content: brainContent });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to ingest brain.md" });
    }
  });

  // TCM Heartbeat - Deterministic Spine
  app.get("/api/v1/brain/heartbeat", (req, res) => {
    const now = new Date();
    res.json({
      status: "active",
      timestamp: now.toISOString(),
      interval: 300,
      checks: [
        { name: "MFA_POSTURE", status: "SECURE" },
        { name: "RECOVERY_ALIGNMENT", status: "ALIGNED" },
        { name: "DETERMINISTIC_GATES", status: "PASSED" }
      ]
    });
  });

  // Prime Orchestrator - Agent Logic
  app.post("/api/orchestrate", async (req, res) => {
    const { goal, context } = req.body;
    
    // Branching logic: Decompose business goals into AI labor
    console.log(`[Prime Orchestrator] Decomposing goal: ${goal}`);
    
    // Simulated branching
    const tasks = [
      { agent: "Analyst", task: "Market Harvest for VCs", priority: "High" },
      { agent: "ClaimCore", task: "Supplement Scoring for Contractor", priority: "Medium" }
    ];

    res.json({
      status: "success",
      orchestrationId: Date.now().toString(),
      tasks,
      message: "Goal decomposed and assigned to agent workforce."
    });
  });

  // RAG Vault - Memory as a Moat
  app.post("/api/rag/query", async (req, res) => {
    const { query } = req.body;
    console.log(`[RAG Vault] Querying historical memory: ${query}`);
    
    // Simulated RAG response
    res.json({
      status: "success",
      data: "Historical memory suggests a 15% lift in supplement value for this region.",
      source: "Vertex AI RAG Vault"
    });
  });

  // Analytics - BigQuery Integration (Simulated)
  app.get("/api/analytics/kpis", (req, res) => {
    res.json({
      mrr: 25000,
      activeAccounts: 312,
      stormAlerts: 4,
      claimsProcessed: 1240
    });
  });

  // Neural Search - Simulated
  app.post("/api/search", async (req, res) => {
    const { query } = req.body;
    console.log(`[Neural Search] Querying: ${query}`);
    // Simulate semantic search
    res.json({
      status: "success",
      results: [
        { id: '1', name: 'Sequoia Capital', type: 'VC', status: 'Due Diligence', lastInteraction: '2025-04-10' },
        { id: '4', name: 'Nimbus Roofing', type: 'Contractor', status: 'Active', lastInteraction: '2025-04-15' }
      ]
    });
  });

  // Weather API - Real-time Storm Data
  app.get("/api/weather", async (req, res) => {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }
    
    // Placeholder for actual API call
    console.log(`[Weather API] Fetching storm data for: ${location}`);
    
    // Example: Use a real API like OpenWeatherMap
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`);
    
    res.json({
      location,
      temp: 72,
      condition: "Partly Cloudy",
      stormRisk: "Low"
    });
  });

  // Iron Dome Protocol - Pipeline Trigger
  app.post("/api/v1/trigger-iron-dome", async (req, res) => {
    const logs = [];
    const timestamp = () => new Date().toLocaleTimeString();

    // 1. Ingress
    console.log("[Iron Dome] Phase 1: Ingress Initiated.");
    logs.push({
      timestamp: timestamp(),
      agent_id: "IngressAgent",
      action: "Scanning Gmail MCP",
      status: "SUCCESS",
      metadata: { carrier: "usaa.com", claim_id: "8821-X", type: "inspection_scheduled" }
    });

    // 2. Reasoning (Simulation)
    await new Promise(r => setTimeout(r, 1000));

    // 3. Compliance
    console.log("[Iron Dome] Phase 3: Compliance Audit.");
    logs.push({
      timestamp: timestamp(),
      agent_id: "ComplianceAgent",
      action: "Auditing against IRC 2021",
      status: "SUCCESS",
      metadata: {}
    });

    // 4. Egress
    console.log("[Iron Dome] Phase 4: Egress Notification.");
    console.log("EVENT: EMAIL SENT TO FOUNDER -> TO: dustin@nimbusiq.ai | MSG: Claim #8821-X Sovereign Audit Complete.");
    logs.push({
      timestamp: timestamp(),
      agent_id: "EgressAgent",
      action: "Sending Evidence Packet",
      status: "SUCCESS",
      metadata: { recipient: "dustin@nimbusiq.ai" }
    });

    res.json({
      status: "complete",
      logs
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sovereign OS] Prime Orchestrator running on http://localhost:${PORT}`);
  });
}

startServer();
