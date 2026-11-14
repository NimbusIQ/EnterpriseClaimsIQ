// Sovereign API Contracts
// Defines the communication layer between the React Frontend and the Sentinel Backend

export type AccessLevel = 'public_resume' | 'sovereign_admin';

// Unified Response Format
export interface SovereignApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  lineageId?: string; // For tracing back to BigQuery audit logs
}

// -----------------------------------------------------
// Agent: Atlas (Roofing Supplement Ins Agent)
// -----------------------------------------------------

/**
 * Executes the proprietary SATCALC V2 algorithm against the Triple-RAG Knowledge Cluster.
 */
export interface GenerateSupplementRequest {
  claim_number?: string;
  roof_area_squares: number;
  damage_percentage: number;
  location: string;
  roof_type?: string;
  pdf_mode?: 'json' | 'onepager' | 'full';
}

export interface AtlasSupplementResponse {
  grand_total: number;
  justification: string;
  missing_line_items: string[];
  code_citations: string[];
  pdf_url?: string;
}

// -----------------------------------------------------
// Agent: ClaimCore Forensic Agent
// -----------------------------------------------------

export interface ClaimCorePropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface ClaimCoreRoofMetrics {
  squares: number;
  pitch: string;
  waste_percentage: number;
  shingle_type: string;
}

export interface ClaimCoreCarrierInfo {
  carrier_name: string;
  adjuster_name?: string;
  initial_acv?: number;
  initial_rcv?: number;
  deductible?: number;
}

export interface ClaimCoreForensicRequest {
  claim_id: string;
  scope_of_loss_text: string;
  photo_evidence_urls?: string[];
  property_location: ClaimCorePropertyLocation;
  roof_metrics: ClaimCoreRoofMetrics;
  jurisdiction_codes?: string[];
  carrier_info?: ClaimCoreCarrierInfo;
}

export interface ClaimCoreMissingLineItem {
  xactimate_code: string;
  description: string;
  unit_price: number;
  quantity: number;
  unit: string;
  total_price: number;
  building_code_citation: string;
  evidence_photo_ref?: string;
}

export interface ClaimCoreForensicResponse {
  claim_id: string;
  supplement_summary: {
    original_rcv: number;
    calculated_rcv: number;
    net_claim_leakage: number;
    contractor_margin_op: number;
  };
  missing_line_items: ClaimCoreMissingLineItem[];
  rebuttal_letter_markdown: string;
  xactimate_xml_payload: string;
  confidence_score: number;
  audit_lineage_id: string;
}

// -----------------------------------------------------
// Agent: Dr. Yu (TCM Diet Agent / Shen OS)
// -----------------------------------------------------

/**
 * Retrieves the current Traditional Chinese Medicine (TCM) context,
 * bridging the International Fixed Calendar (IFC) and TCM Seasonal Clock.
 */
export interface TCMTemporalContextRequest {
  user_id: string;
  current_datetime: string;
  user_location_state?: string;
}

export interface TCMTemporalContextResponse {
  tcm_season: string;
  active_organ: string;
  recommended_diet_focus: string;
  grok_score_alignment: number;
}

// -----------------------------------------------------
// Agent Orchestration (ADK / A2A Protocol)
// -----------------------------------------------------
export interface AgentTask {
  agent: string;
  task: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface OrchestrationRequest {
  goal: string;
  context: Record<string, any>;
}

export interface OrchestrationResponse {
  orchestrationId: string;
  tasks: AgentTask[];
  message: string;
}

// -----------------------------------------------------
// Vertex AI / ADK Tool Schema Definition
// -----------------------------------------------------
export const CLAIMCORE_FORENSIC_TOOL_SCHEMA = {
  name: "claimcore_forensic_audit",
  description: "Executes a deep forensic audit of carrier scopes of loss against IRC/IBC building codes, identifying claim leakage and generating Xactimate XML + adjuster rebuttal letters.",
  parameters: {
    type: "OBJECT",
    properties: {
      claim_id: { type: "STRING", description: "Unique insurance claim identifier (e.g., TX-2026-9910)" },
      scope_of_loss_text: { type: "STRING", description: "Raw OCR or text content of the insurance estimate" },
      photo_evidence_urls: { 
        type: "ARRAY", 
        items: { type: "STRING" }, 
        description: "URIs/URLs to high-res roof inspection photos" 
      },
      property_location: {
        type: "OBJECT",
        properties: {
          address: { type: "STRING" },
          city: { type: "STRING" },
          state: { type: "STRING" },
          zip: { type: "STRING" }
        },
        required: ["state"]
      },
      roof_metrics: {
        type: "OBJECT",
        properties: {
          squares: { type: "NUMBER", description: "Total roof area in squares (1 SQ = 100 sq ft)" },
          pitch: { type: "STRING", description: "Roof pitch, e.g. '7/12'" },
          waste_percentage: { type: "NUMBER", description: "Material waste factor (e.g. 15 for 15%)" },
          shingle_type: { type: "STRING", description: "E.g., Architectural, 3-Tab, Impact-Resistant Class 4" }
        },
        required: ["squares"]
      },
      jurisdiction_codes: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "Applicable building codes (e.g. ['IRC 2021', 'Texas Ins Code Ch 542'])"
      },
      carrier_info: {
        type: "OBJECT",
        properties: {
          carrier_name: { type: "STRING" },
          adjuster_name: { type: "STRING" },
          initial_acv: { type: "NUMBER" },
          initial_rcv: { type: "NUMBER" },
          deductible: { type: "NUMBER" }
        }
      }
    },
    required: ["claim_id", "scope_of_loss_text", "property_location", "roof_metrics"]
  }
};

