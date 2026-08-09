/**
 * HumanOS State Engine
 * Manages rolling 10-second temporal window buffer, continuous risk scoring, and posture classification.
 */

const WINDOW_SIZE = 30; // ~10 seconds at 3 fps sampling
const historyBuffer = [];

export function updateHumanState(features) {
  if (!features) return null;

  // Push to circular buffer
  historyBuffer.push({
    timestamp: Date.now(),
    ...features
  });

  if (historyBuffer.length > WINDOW_SIZE) {
    historyBuffer.shift();
  }

  // Calculate baseline (first 5 samples) vs current window (last 5 samples)
  let baselineRisk = 0.2;
  let currentRisk = 0.2;

  const currentStability = features.stabilityScore;
  currentRisk = Number((1.0 - currentStability).toFixed(2));

  if (historyBuffer.length >= 6) {
    const earlySamples = historyBuffer.slice(0, 3);
    const recentSamples = historyBuffer.slice(-3);

    const earlyAvgStab = earlySamples.reduce((acc, s) => acc + s.stabilityScore, 0) / earlySamples.length;
    const recentAvgStab = recentSamples.reduce((acc, s) => acc + s.stabilityScore, 0) / recentSamples.length;

    baselineRisk = 1.0 - earlyAvgStab;
    currentRisk = 1.0 - recentAvgStab;
  }

  // Trend detection
  let trend = "stable";
  const delta = currentRisk - baselineRisk;
  if (delta > 0.08) {
    trend = "increasing";
  } else if (delta < -0.08) {
    trend = "decreasing";
  }

  // Posture label mapping
  let posture = "stable";
  if (currentRisk >= 0.7) {
    posture = "critical";
  } else if (currentRisk >= 0.45) {
    posture = "unstable";
  } else if (features.torsoAngle > 12) {
    posture = "leaning";
  }

  return {
    posture,
    stability: currentStability,
    risk: Number(currentRisk.toFixed(2)),
    trend,
    torsoAngle: features.torsoAngle,
    kneeAngle: features.kneeAngle,
    movementVelocity: features.movementVelocity,
    timestamp: new Date().toISOString(),
    historyLength: historyBuffer.length
  };
}
