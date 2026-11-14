# NIMBUS IQ: AGENT PEDAGOGY & TRAINING CURRICULUM
**Internal Engineering Guide: Forging Sovereign Agents (Atlas, Dr. Yu, Gemma IQ)**

## 1. Description: The "Photonic-Void" Training Methodology
Unlike traditional model training (which requires expensive pre-training of base weights), the Nimbus IQ ecosystem utilizes the **Photonic-Void Agentic Pedagogy**. We begin with a frontier intelligence model (Gemini 2.5 Pro or Gemini 3 Flash) and forge it into a specialized, deterministic actor ("Agent") through strict environmental conditioning, memory grounding, and schema-enforced tooling. 

The training process does not teach the agent *how to think*; it teaches the agent *what to know, what to do, and what rules it cannot break*.

### The Four Pillars of Agentic Training:
1. **Persona & Directives (System Prompts):** The absolute laws of operation (e.g., Truth > Speed). 
2. **Contextual Grounding (RAG Storage):** Injecting proprietary domain expertise (Building Codes, TCM Theories).
3. **Kinetic Capabilities (Function Calling):** Teaching the agent how to trigger physical or digital actions (APIs).
4. **Behavioral Alignment (RLHF & The Ghost Engineer):** Iterative human-in-the-loop validation via the Iron Dome process.

---

## 2. Instructions: Step-by-Step Agent Training Process

To train, deploy, and align a new Sovereign Agent within the Nimbus IQ ecosystem, developers must execute the following pipeline.

### Phase 1: Cognitive Initialization (Identity Injection)
Before an agent has tools or data, it must have an identity.
1. **Define the Base Profile:** Outline the `<role>`, `<persona>`, and `<global_directives>` in XML-style tags.
2. **Set the Temperature to Zero:** For operational agents (like Atlas), set the model temperature strictly to `0.0` or `0.1`. Creative hallucinations are strictly prohibited in the supplement and compliance verticals.
3. **Register with the Master Brain:** Add the agent's profile to `/antigravity/brain.md` so the **Gemma Robotics IQ** orchestrator knows the new agent exists and can route tasks to it.

### Phase 2: Domain Grounding (The RAG Moat)
An agent is only as intelligent as the data it is grounded against.
1. **Assemble the Knowledge Base:** For example, to train the **Atlas Agent**, ingest the IRC 2021 building codes, Texas Insurance Code Chapter 542, and GAF/Owens Corning installation manuals.
2. **Vector Space Mapping:** Process the PDFs and manuals into embeddings utilizing `Neural Memory` workflows and store them locally (or in Vertex AI Search / AlloyDB PostgreSQL with `pgvector`).
3. **Define RAG Retrieval Triggers:** Instruct the agent to execute a semantic search *before* it synthesizes a final total or analysis. Emphasize the rule: *If the answer is not in the Knowledge Cluster, escalate to human.*

### Phase 3: Tool Execution (Agentic Limbs)
To interact with the software stack (CRM, Payment Gateways, API endpoints), the agent must be trained on precise tooling schemas.
1. **Define the JSON Schema:** Write strict OpenAPI/JSON schemas for every required tool (e.g., `generate_supplement`, `get_tcm_temporal_context`).
2. **Prompt for "Missing Parameters" Loop (The Validation Loop):** Train the agent that it *cannot* hallucinate parameters. Provide few-shot examples showing the agent:
   - *User:* "The damage is bad."
   - *Agent:* "I need the precise roof area in squares and the estimated damage percentage before I can run the SATCALC V2 algorithm."
3. **Map to Sovereign API Contracts:** Ensure the tool definitions map identically to the TypeScript interfaces defined in `src/types/sovereign-api.ts`.

### Phase 4: Iron Dome Validation (RLHF & "Ghost Engineer" Loop)
Agent behavior will drift without continuous auditing.
1. **Shadow Mode Deployment ('Staging'):** Run the agent in "read-only" shadow mode inside the Iron Dome Dashboard. It processes ingress data and proposes actions (e.g., a supplement amount), but does not send emails or commit CRM transactions.
2. **Founder Egress Notifications:** Route all proposed outputs to the administrative tier via MCP (e.g., `dustin@nimbusiq.ai`). 
3. **Feedback Injection:** If the agent misses a line item or incorrectly cites a building code, the expert (Ghost Engineer) corrects the output. This corrected delta is logged into BigQuery to fine-tune the agent's confidence scoring model for future encounters.

---

## 3. Training Command (ADK Pipeline Example)
Once the training logic (System Prompt, RAG connection, and Tool schemas) is assembled in the workspace, you validate the agent using the Agent Development Kit (ADK) testing suite:

```bash
# 1. Run the local Agentic Pedagogy Test Suite
npm run test:agents -- --agent=atlas --mode=forensic

# 2. Deploy to Vertex AI Agent Engine for Real-World Iteration
adk deploy --runtime vertex-agent-engine \
           --name "Atlas-Roofing-Supplement-Agent" \
           --image gcr.io/nimbus-iq-ai/atlas-agent:v1 \
           --training-mode shadow \
           --rag-cluster triple-rag-vpc
```

### Safety & Sovereignty Constraint
**NEVER** skip Phase 4 (Iron Dome Validation). Any agent granted write-access to the `Nimbus Sovereign API` without passing a 99% accuracy threshold in Staging is considered a breach of the Sovereign Architecture protocols.
