/**
 * MediaPipe Pose Processing Pipeline (Royal White Theme Edition)
 * Initializes PoseLandmarker from @mediapipe/tasks-vision via CDN, streams webcam, and draws skeletal overlay.
 */

import { extractKinematicFeatures } from './features.js';

let poseLandmarker = null;
let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let lastVideoTime = -1;
let animFrameId = null;

// Pose Joint Connections (MediaPipe Topology)
const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body & arms
  [11, 23], [12, 24], [23, 24],                    // Torso
  [23, 25], [25, 27], [24, 26], [26, 28]           // Legs
];

export async function initPosePipeline(onFeaturesExtracted) {
  videoElement = document.getElementById('webcam');
  canvasElement = document.getElementById('skeletonCanvas');
  canvasCtx = canvasElement.getContext('2d');

  try {
    // Load MediaPipe Vision tasks bundle dynamically from CDN
    const { PoseLandmarker, FilesetResolver } = await import(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs"
    );

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numPoses: 1
    });

    document.getElementById('videoLoader').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('videoLoader').style.display = 'none';
    }, 500);

    // Start Webcam Stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 360, frameRate: { ideal: 30 } }
    });
    videoElement.srcObject = stream;

    videoElement.addEventListener('loadeddata', () => {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      renderLoop(onFeaturesExtracted);
    });

  } catch (err) {
    console.error("MediaPipe initialization error:", err);
    document.getElementById('videoLoader').innerHTML = `
      <p style="color: #b91c1c; font-weight: bold;">Camera Access / MediaPipe Init Error</p>
      <p style="font-size: 0.8rem; color: #64748b;">${err.message || 'Please enable webcam permissions'}</p>
    `;
  }
}

function renderLoop(onFeaturesExtracted) {
  if (videoElement.currentTime !== lastVideoTime && poseLandmarker) {
    lastVideoTime = videoElement.currentTime;
    const startTimeMs = performance.now();
    const results = poseLandmarker.detectForVideo(videoElement, startTimeMs);

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];

      // 1. Draw Skeleton Connections (Royal Gold & Sapphire Glow)
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = 'rgba(212, 175, 55, 0.85)'; // Royal Gold stroke
      for (const [i1, i2] of POSE_CONNECTIONS) {
        const p1 = landmarks[i1];
        const p2 = landmarks[i2];
        if (p1 && p2 && (p1.visibility || 1) > 0.4 && (p2.visibility || 1) > 0.4) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(p1.x * canvasElement.width, p1.y * canvasElement.height);
          canvasCtx.lineTo(p2.x * canvasElement.width, p2.y * canvasElement.height);
          canvasCtx.stroke();
        }
      }

      // 2. Draw Landmark Keypoints (Royal Sapphire & Gold Nodes)
      for (let i = 11; i <= 28; i++) {
        const lm = landmarks[i];
        if (lm && (lm.visibility || 1) > 0.4) {
          const cx = lm.x * canvasElement.width;
          const cy = lm.y * canvasElement.height;

          canvasCtx.beginPath();
          canvasCtx.arc(cx, cy, 6, 0, 2 * Math.PI);
          canvasCtx.fillStyle = '#0f2b5c'; // Royal Sapphire fill
          canvasCtx.strokeStyle = '#d4af37'; // Royal Gold border
          canvasCtx.lineWidth = 2;
          canvasCtx.shadowColor = 'rgba(212, 175, 55, 0.6)';
          canvasCtx.shadowBlur = 10;
          canvasCtx.fill();
          canvasCtx.stroke();
        }
      }

      // 3. Extract features & notify state engine
      const features = extractKinematicFeatures(landmarks);
      if (features && onFeaturesExtracted) {
        onFeaturesExtracted(features);
      }
    }
  }

  animFrameId = requestAnimationFrame(() => renderLoop(onFeaturesExtracted));
}
