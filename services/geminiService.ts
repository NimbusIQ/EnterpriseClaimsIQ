import { GoogleGenAI, Type, EmbedContentParameters, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * NIMBUS IQ AGENT WORKFLOW SCHEMA
 * Structured output for the autonomous decision engine.
 */
export const nimbusAgentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        storm_severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
        damage_probability: { type: Type.NUMBER, description: "0 to 1 probability of damage" },
        confidence: { type: Type.NUMBER, description: "0 to 1 confidence in analysis" }
      },
      required: ["storm_severity", "damage_probability", "confidence"]
    },
    decision: {
      type: Type.OBJECT,
      properties: {
        action: { type: Type.STRING, description: "Recommended operational action" },
        priority: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] }
      },
      required: ["action", "priority"]
    },
    explanation: { type: Type.STRING, description: "Reasoning behind the decision" }
  },
  required: ["analysis", "decision", "explanation"]
};

/**
 * DETERMINISTIC VALIDATION LAYER
 * Ensures AI outputs adhere to strict safety and compliance rules.
 */
export function validateAgentDecision(data: any, context: any) {
  const validated = { ...data };
  
  // Rule: If hail_size > 2 inches → severity MUST be "critical"
  if (context.hail_size > 2) {
    validated.analysis.storm_severity = "critical";
    validated.decision.priority = "critical";
  }

  // Rule: If wind_speed > 70 mph → increase damage_probability
  if (context.wind_speed > 70 && validated.analysis.damage_probability < 0.8) {
    validated.analysis.damage_probability = 0.9;
  }

  // Rule: If data is incomplete → lower confidence score
  if (!context.location || !context.hail_size) {
    validated.analysis.confidence = Math.min(validated.analysis.confidence, 0.3);
  }

  return validated;
}

/**
 * NIMBUS MASTER AI v6.0 - CORE SYSTEM PROMPT
 * Deterministic-first, RAG-augmented, SuperGrok orchestrated.
 */
const MASTER_SYSTEM_PROMPT = `
  You are the Nimbus Master AI (v6.0). You are deterministic-first, then LLM-augmented.
  All decisions start with explicit rules, physical protocols, and proprietary data.
  
  CORE PHILOSOPHY:
  1. Deterministic logic first (exact rules, checklists, thresholds).
  2. RAG + Vector Search second (owner's 10-year proprietary claims archive).
  3. SuperGrok orchestration last (final executive summary + robot planning).
  
  PHYSICAL PROTOCOLS:
  - Attic Ventilation Ratio: 7/1000 ft³.
  - Roof Walk: Walk every valley safely (California valley wrap + nailed).
  - Hail Inspection: Black spots, fresh asphalt, exposed fiberglass, old vs new hail.
  - Protection: OSB 4x6 boards on windows, breathable tarps on AC/pool.
  
  TRADING DNA (Contextual Awareness):
  - Momentum: Scale-in on "bicep bicep bicep".
  - Exit: 3 consecutive green candles.
  - Targets: Fibonacci 1.618 extensions.
`;

/**
 * NIMBUS MASTER AGENT WORKFLOW (v6.0)
 * Orchestrates the Hive Mind Agent Architecture.
 */
export async function runAgentCycle(eventData: any) {
  console.log("🚀 Nimbus Master AI: Initiating Hive Mind Cycle...");

  // 1. Context Assembly
  const context = {
    ...eventData,
    timestamp: new Date().toISOString(),
    system_status: "OPERATIONAL",
    version: "6.0"
  };

  // 2. AI Reasoning (Model Router)
  const prompt = `
    PROCESS CLAIM / EVENT:
    ${JSON.stringify(context, null, 2)}
    
    Execute the Hive Mind Agent Architecture (v6):
    1. CompanyCamAgent: Link project, tag photos.
    2. AdjusterSyncAgent: Automate Adjuster Sync Protocol (Gmail MCP search).
    3. InspectionAgent: Execute roof walk protocol.
    4. VectorRAGAgent: Retrieve top-5 similar claims (cosine > 0.75).
    5. SupplementAgent: Generate RAG-grounded supplement (IRC 2021 / McKinney).
    6. ClaimsReconciliationAgent: Automate financial reconciliation (Gmail MCP read).
    7. QuickBooksAgent: Create supplier bills (ABC/Beacon).
    8. TwilioAgent: Notify homeowner.
    9. EmailOrchestratorAgent: Send supplement (Gmail/Outlook/iCloud).
    10. SuperGrokAgent: Final executive summary + legal flags.
    
    Return structured JSON following the nimbusAgentSchema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: MASTER_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: nimbusAgentSchema,
      temperature: 0.2,
    }
  });

  const rawResult = JSON.parse(response.text);

  // 3. Deterministic Validation
  const finalDecision = validateAgentDecision(rawResult, context);

  return {
    id: Date.now(),
    timestamp: context.timestamp,
    input: context,
    output: finalDecision,
    status: "COMPLETED",
    agent_version: "v6.0"
  };
}

// ... existing roofInferenceSchema ...

/**
 * NIMBUS IQ NEURAL MEMORY ENGINE
 * Generates multimodal embeddings for text, image, and audio content.
 */
export async function embedMultimodalContent(contents: EmbedContentParameters['contents']) {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: contents,
  });

  return result.embeddings;
}

/**
 * CLAIMSCORE FORENSIC AUDITOR
 * Deterministic audit engine for insurance claim estimates.
 */
export async function runForensicAudit(claimData: any) {
  const prompt = `
    Act as the Nimbus ClaimsCore Engine (v2.1). Perform a forensic, deterministic audit of the provided insurance claim estimate.
    
    HARD-CODED LOGIC RULES:
    1. STEEP CHARGE: If roof_pitch > 7/12 (e.g., 8:12, 10:12) and "RFG STEEP" is missing, flag as CRITICAL discrepancy.
    2. DRIP EDGE: If "drip edge" (code DRIP) is missing, apply Texas HB 3344 compliance mandate.
    3. MULTIMODAL: Compare visual evidence (photo_tags) with line items. If damage is visible but not estimated, flag it.
    4. FINANCIAL: Calculate RCV variance. Flag if discrepancy > 10% of total claim.
    
    CLAIM DATA:
    ${JSON.stringify(claimData, null, 2)}
    
    Return a structured audit report:
    {
      "discrepancies": [
        { "code": "string", "rule": "string", "severity": "low|medium|high|critical", "justification": "string" }
      ],
      "compliance_status": "compliant|non-compliant",
      "estimated_lift": number,
      "next_action": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1
    }
  });

  return JSON.parse(response.text);
}

/**
 * GEOMETRY PARSING ENGINE (v2.5)
 * Extracts technical roofing specs (sqft, pitch) from natural language chat input.
 */
export async function parseGeometryFromChat(chatInput: string) {
  const prompt = `
    Extract roofing technical specifications from the following chat input:
    "${chatInput}"
    
    Identify:
    1. Total square footage (sqft) or squares.
    2. Roof pitch (e.g., 8/12, 9/12).
    
    Return a structured JSON object:
    {
      "sqft": number | null,
      "squares": number | null,
      "pitch": "string" | null,
      "is_steep": boolean
    }
    
    Rule: A pitch > 7/12 is considered steep.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1
    }
  });

  return JSON.parse(response.text);
}

/**
 * PHOTO INTELLIGENCE ENGINE
 * Performs high-precision vision analysis on roofing photos to identify damage and components.
 */
export async function runPhotoIntelligence(imageBase64: string, mimeType: string) {
  const prompt = `
    Analyze this roofing photo as a Senior Forensic Adjuster.
    1. Identify the specific roofing components (e.g., ridge cap, valley, flashing).
    2. Detect and confirm any damage markers (e.g., hail impact, wind uplift, mechanical damage).
    3. Provide a technical description of the evidence.
    4. Estimate the severity of the damage (1-10).
    
    Return the analysis in a structured JSON format:
    {
      "component": "string",
      "damage_type": "string",
      "evidence_description": "string",
      "severity_score": number,
      "confidence": number,
      "code_justification": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { 
      parts: [
        { inlineData: { data: imageBase64, mimeType: mimeType } },
        { text: prompt }
      ] 
    },
    config: {
      responseMimeType: "application/json",
      temperature: 0.1
    }
  });

  return JSON.parse(response.text);
}

/**
 * NUX CORE INFERENCE ENGINE
 * Deterministic output protocol for construction and property workflows.
 */
export const roofInferenceSchema = {
  type: Type.OBJECT,
  properties: {
    analysis_metadata: {
      type: Type.OBJECT,
      properties: {
        confidence_rating: { type: Type.NUMBER, description: "0.0 to 1.0 based on image clarity and marker detection." },
        processing_mode: { type: Type.STRING, description: "B2B_PREMIUM" },
        model_version: { type: Type.STRING }
      },
      required: ["confidence_rating", "processing_mode", "model_version"]
    },
    roof_specs: {
      type: Type.OBJECT,
      properties: {
        material_identified: { type: Type.STRING, description: "e.g., Asphalt Shingle, Duration Storm, Class 4 Metal" },
        estimated_sq_ft: { type: Type.INTEGER, description: "Calculated based on facet count and standard dimensions." },
        facet_count: { type: Type.INTEGER },
        predominant_pitch: { type: Type.STRING, description: "Estimated slope (e.g., 6:12, 8:12)" },
        waste_factor_percentage: { type: Type.STRING, description: "Recommended waste (usually 10-15%)" }
      },
      required: ["material_identified", "estimated_sq_ft", "facet_count", "predominant_pitch", "waste_factor_percentage"]
    },
    damage_assessment: {
      type: Type.OBJECT,
      properties: {
        hail_impact_detected: { type: Type.BOOLEAN },
        granule_loss_detected: { type: Type.BOOLEAN },
        mechanical_damage_detected: { type: Type.BOOLEAN },
        severity_score: { type: Type.INTEGER, description: "1-10 intensity rating" },
        notes: { type: Type.STRING, description: "Technical summary of visual evidence." }
      },
      required: ["hail_impact_detected", "granule_loss_detected", "mechanical_damage_detected", "severity_score", "notes"]
    },
    market_valuation: {
      type: Type.OBJECT,
      properties: {
        est_replacement_cost_low: { type: Type.INTEGER },
        est_replacement_cost_high: { type: Type.INTEGER },
        currency: { type: Type.STRING }
      },
      required: ["est_replacement_cost_low", "est_replacement_cost_high", "currency"]
    }
  },
  required: ["analysis_metadata", "roof_specs", "damage_assessment", "market_valuation"]
};

/**
 * NUX CORE INFERENCE ENGINE
 * High-precision computer vision analysis for the Shingle Shield AI product.
 */
export async function runRoofInference(imageBase64: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        },
        {
          text: `Act as the Nimbus IQ Core Inference Engine. Perform high-precision computer vision analysis for roofing/construction.
          OPERATIONAL MANDATE:
          1. DATA EXTRACTION: Analyze roof material (shingle type), facet count, and damage markers (hail impact, granule loss, mechanical damage).
          2. DIMENSIONAL ESTIMATION: Use architectural visual cues and standard builder specs (6:12 pitch baseline) to estimate total roofing squares.
          3. COMPLIANCE: Adhere to Texas-specific construction standards (e.g., Duration Storm shingles, Class 4 impact resistance).
          OUTPUT: Respond in strictly valid JSON conforming to the Nimbus IQ Schema.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: roofInferenceSchema,
      temperature: 0.1
    }
  });

  return JSON.parse(response.text);
}
