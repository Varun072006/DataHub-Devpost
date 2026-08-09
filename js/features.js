/**
 * Kinematics Feature Extractor
 * Calculates angles, velocities, and stability indices from MediaPipe Pose landmarks.
 * 
 * Key MediaPipe Landmark Indices:
 * 11: Left Shoulder, 12: Right Shoulder
 * 23: Left Hip, 24: Right Hip
 * 25: Left Knee, 26: Right Knee
 * 27: Left Ankle, 28: Right Ankle
 */

let prevLandmarks = null;

export function extractKinematicFeatures(landmarks) {
  if (!landmarks || landmarks.length < 33) {
    return null;
  }

  // 1. Torso Angle (Tilt from vertical)
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;

  const dx = shoulderMidX - hipMidX;
  const dy = shoulderMidY - hipMidY; // Screen Y goes downwards
  
  // Angle relative to vertical vector (0, -1)
  const torsoAngleRad = Math.atan2(dx, -dy);
  const torsoAngleDeg = Math.round(Math.abs(torsoAngleRad * (180 / Math.PI)));

  // 2. Knee Flex Angles (Hip -> Knee -> Ankle)
  const leftKneeAngle = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
  const rightKneeAngle = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);

  // 3. Movement Velocity & Jitter (displacement from previous frame)
  let movementVelocity = 0.02; // default baseline
  if (prevLandmarks && prevLandmarks.length === landmarks.length) {
    let totalDisplacement = 0;
    // Check main body trunk joints (shoulders, hips, knees)
    const trackedIndices = [11, 12, 23, 24, 25, 26];
    for (const idx of trackedIndices) {
      const p1 = landmarks[idx];
      const p2 = prevLandmarks[idx];
      const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      totalDisplacement += dist;
    }
    movementVelocity = Number((totalDisplacement / trackedIndices.length).toFixed(3));
  }
  prevLandmarks = landmarks;

  // 4. Stability Score (1.0 = highly stable, 0.0 = critical instability)
  // Penalize torso tilt > 12 deg, knee flex < 150 deg, velocity > 0.05
  let stabilityPenalties = 0;
  if (torsoAngleDeg > 10) stabilityPenalties += (torsoAngleDeg - 10) * 0.035;
  if (leftKneeAngle < 155) stabilityPenalties += (155 - leftKneeAngle) * 0.015;
  if (rightKneeAngle < 155) stabilityPenalties += (155 - rightKneeAngle) * 0.015;
  if (movementVelocity > 0.04) stabilityPenalties += (movementVelocity - 0.04) * 8.0;

  const stabilityScore = Math.max(0.1, Math.min(1.0, Number((1.0 - stabilityPenalties).toFixed(2))));

  return {
    torsoAngle: torsoAngleDeg,
    kneeAngle: {
      left: Math.round(leftKneeAngle),
      right: Math.round(rightKneeAngle)
    },
    movementVelocity,
    stabilityScore
  };
}

/**
 * Calculates 2D angle at vertex B formed by points A-B-C
 */
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180.0 / Math.PI));
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}
