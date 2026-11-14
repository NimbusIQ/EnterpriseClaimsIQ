import { analyzeImage } from "./hailService";
import { gmailMcpService } from "./gmailMcpService";

export async function agent_pipeline(data: any) {
  // 1. Validate
  if (!data.image) throw new Error("No image provided");

  // 2. Adjuster Sync (New)
  const syncResults = await gmailMcpService.searchMessages({
    q: "from:usaa.com OR from:farmers.com",
    max_results: 5
  });

  // 3. Vision Analysis
  const vision = await analyzeImage(data.image, "image/jpeg");

  // 4. Damage Analysis
  const damage = {
    ...vision,
    damage_status: vision.hail_hits > 8 ? "high" : "low",
    adjuster_sync: syncResults
  };

  // 5. Estimate
  const estimate = {
    ...damage,
    estimated_cost: vision.hail_hits * 1500
  };

  // 6. Claims Reconciliation (New)
  const reconciliation = await gmailMcpService.readThreads({
    thread_id: "payment_notice_thread_id_123"
  });

  // 7. Claim
  return {
    ...estimate,
    reconciliation_data: reconciliation,
    claim_ready: estimate.damage_status === "high"
  };
}
