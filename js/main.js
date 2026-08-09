/**
 * HumanOS Sentinel — Main Application Bootstrap
 */

import { initPosePipeline } from './pose.js';
import { updateHumanState } from './risk.js';
import { updateMetricsUI, renderInvestigationReport, animateStepChips, showTrustModal, hideTrustModal } from './ui.js';
import { triggerInvestigation, fetchTrustAudit } from './api.js';

let latestState = null;
let lastAutoInvestigateTime = 0;
let isInvestigating = false;

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Starting HumanOS Sentinel...");

  // Initialize Pose pipeline
  await initPosePipeline(onKinematicFeaturesReceived);

  // Setup Event Listeners
  document.getElementById('investigateBtn').addEventListener('click', () => {
    executeInvestigation();
  });

  document.getElementById('trustBtn').addEventListener('click', async () => {
    if (!latestState) return;
    const auditData = await fetchTrustAudit(latestState);
    showTrustModal(auditData);
  });

  document.getElementById('closeTrustModal').addEventListener('click', () => {
    hideTrustModal();
  });
});

function onKinematicFeaturesReceived(features) {
  latestState = updateHumanState(features);
  if (!latestState) return;

  // Update UI Dashboard metrics
  updateMetricsUI(latestState);

  // Auto-investigate if risk > 0.70 (cooldown 25s)
  const now = Date.now();
  if (latestState.risk >= 0.70 && !isInvestigating && (now - lastAutoInvestigateTime > 25000)) {
    lastAutoInvestigateTime = now;
    console.log("High risk threshold auto-triggering agent investigation...");
    executeInvestigation();
  }
}

async function executeInvestigation() {
  if (isInvestigating || !latestState) return;
  isInvestigating = true;

  const btn = document.getElementById('investigateBtn');
  btn.disabled = true;
  btn.innerHTML = `<span>⏳ AGENT INVESTIGATING...</span>`;

  // Step Animation Sequence
  for (let i = 0; i < 6; i++) {
    animateStepChips(i);
    await new Promise(r => setTimeout(r, 220));
  }

  try {
    const report = await triggerInvestigation(latestState);
    renderInvestigationReport(report);
  } catch (err) {
    console.error("Investigation error:", err);
  } finally {
    isInvestigating = false;
    btn.disabled = false;
    btn.innerHTML = `<span>🔍 INVESTIGATE WITH AGENT</span>`;
  }
}
