# 👑 HumanOS Sentinel

> **Privacy-First Human Risk Intelligence & DataHub Governed AI Agent**
>
> *An autonomous AI system that observes real-time human kinematics, assesses biomechanical fall/injury risk, queries DataHub's metadata graph to trace prediction lineage and model ownership, explains predictions with auditability, and writes safety incidents BACK to DataHub.*

---

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![DataHub Integration](https://img.shields.io/badge/DataHub-GraphQL_%26_REST_GMS-00e5ff.svg)](https://datahub.devpost.com)
[![Agent Intelligence](https://img.shields.io/badge/Agent-Ollama_Tool_Calling-d4af37.svg)](https://ollama.com)
[![Privacy Boundary](https://img.shields.io/badge/Privacy-100%25_Client_Side-059669.svg)](#-privacy-first-computer-vision-boundary)

---

## 🏆 Executive Summary: Why HumanOS Sentinel Wins

Current computer vision systems answer simple questions like: *"Is a person sitting or standing?"*  
**HumanOS Sentinel** solves a fundamental enterprise problem:

> *"What is happening to a worker's physical motion state over time, which ML model produced this risk score, can we trust its data lineage through DataHub, who owns the model, and how do we record governed interventions back to the enterprise catalog?"*

### 🌟 Key Differentiators
1. **Beyond Metadata Reading — Agent Write-Back:** The agent doesn't just read DataHub; when a high-risk posture event occurs, it programmatically creates a **Safety Incident Entity** (`urn:li:dataset:(urn:li:dataPlatform:humanos,incident_<timestamp>,PROD)`) in DataHub's graph, establishing bidirectional metadata flow.
2. **Local LLM Tool Calling Over DataHub:** Powered by Ollama (`qwen2.5:7b`) calling real DataHub GMS REST and GraphQL endpoints (`search_datahub`, `get_entity_metadata`, `get_lineage`, `get_owners`).
3. **100% Edge Privacy Boundary:** Raw optical video frames stay inside the browser and are discarded immediately after MediaPipe landmark extraction. Only anonymized numerical joint coordinates flow to downstream features.
4. **End-to-End Lineage Governance:** Traces 5 levels of upstream/downstream data provenance from raw landmark sensors to executive safety dashboards.
5. **Royal White & Gold Aesthetic:** Designed with a luxury Royal White UI theme (featuring custom SVG emblem, Google Fonts `Cinzel`, and smooth micro-animations).

---

## 🔄 The 5-Stage Agentic Paradigm

```text
  [1] OBSERVE        [2] UNDERSTAND       [3] TRACE          [4] EXPLAIN        [5] ACT
MediaPipe Pose    --> HumanState    --> DataHub Lineage --> LLM Reasoning --> Write Incident
Landmarks (33 pts)    Risk Engine       Graph (5 Hops)      (Ollama Tool)     Back to DataHub
```

---

## 📐 System Architecture

```text
 ┌──────────────────────────────────────────────────────────────────┐
 │                    BROWSER (Vite Dev Server)                     │
 │  • MediaPipe Task Vision (33 Pose Landmarks)                      │
 │  • Privacy Boundary: Raw video discarded in client memory        │
 │  • Kinematics Math (Torso angle, Knee flex, Velocity jitter)    │
 │  • Rolling 10s Circular Buffer (HumanState Engine)              │
 │  • Royal White Glassmorphism UI (Port: http://localhost:5179)    │
 └──────────────────────────────────┬───────────────────────────────┘
                                    │ HumanState JSON
                                    ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │                     FASTAPI AGENT BACKEND                        │
 │                   (Port: http://localhost:8000)                  │
 ├──────────────────────────────────┬───────────────────────────────┤
 │                                  │                               │
 │   Ollama LLM Agent               │   DataHub Tool Integrations   │
 │   • Model: qwen2.5:7b            │   • search_datahub()          │
 │   • Tool-Calling Reasoning       │   • get_entity_metadata()     │
 │   • Root-cause analysis          │   • get_lineage()             │
 │   • Action recommendations       │   • create_incident_in_dh()   │
 └─────────────────┬────────────────┴───────────────┬───────────────┘
                   │                                │
                   ▼                                ▼
       ┌──────────────────────┐          ┌──────────────────────┐
       │   Local Ollama Engine│          │   Real DataHub GMS   │
       │   http://localhost:  │          │   http://localhost:  │
       │   11434              │          │   8080 (REST/GraphQL)│
       └──────────────────────┘          │   9002 (Web UI)      │
                                         └──────────────────────┘
```

---

## 📊 DataHub Context Graph & Lineage Universe

HumanOS Sentinel establishes a 5-level lineage dependency chain in DataHub:

```text
┌──────────────────┐
│  pose_landmarks  │  (Dataset — ML Platform Team)
└────────┬─────────┘  [Raw 33D Landmark Vectors, PII-Free]
         │
         ▼
┌──────────────────┐
│ motion_features  │  (Dataset — ML Platform Team)
└────────┬─────────┘  [Torso tilt, Joint flex angles, Velocity]
         │
         ▼
┌──────────────────────┐
│ fall_risk_features   │  (Dataset — ML Platform Team)
└────────┬─────────────┘  [Rolling 10s Window Stability Metrics]
         │
         ▼
┌──────────────────┐
│ humanos-risk-v1  │  (ML Model — HumanOS Safety Team)
└────────┬─────────┘  [Accuracy: 94%, F1: 0.91, Version: 2.1.0]
         │
         ▼
┌──────────────────────┐
│ human_motion_events  │  (Dataset — HumanOS Safety Team)
└────────┬─────────────┘  [Stream of high-risk posture alerts]
         │
         ▼
┌──────────────────────────────┐
│ workplace-safety-dashboard   │  (Dashboard — Safety Operations)
└──────────────────────────────┘  [Executive & Operational View]
```

### Entity Metadata Table

| Entity Name | Type | DataHub URN | Owner | Tags |
|-------------|------|-------------|-------|------|
| `pose_landmarks` | DATASET | `urn:li:dataset:(urn:li:dataPlatform:humanos,pose_landmarks,PROD)` | ML Platform Team | `pii-free`, `privacy-boundary`, `real-time` |
| `motion_features` | DATASET | `urn:li:dataset:(urn:li:dataPlatform:humanos,motion_features,PROD)` | ML Platform Team | `kinematics`, `features` |
| `fall_risk_features` | DATASET | `urn:li:dataset:(urn:li:dataPlatform:humanos,fall_risk_features,PROD)` | ML Platform Team | `features`, `windowed`, `fall-risk` |
| `humanos-posture-v1` | MLMODEL | `urn:li:mlModel:(urn:li:dataPlatform:humanos,humanos-posture-v1,PROD)` | HumanOS Safety Team | `ml-model`, `posture-classifier` |
| `humanos-risk-v1` | MLMODEL | `urn:li:mlModel:(urn:li:dataPlatform:humanos,humanos-risk-v1,PROD)` | HumanOS Safety Team | `ml-model`, `risk-predictor`, `safety-critical` |
| `human_motion_events` | DATASET | `urn:li:dataset:(urn:li:dataPlatform:humanos,human_motion_events,PROD)` | HumanOS Safety Team | `events`, `safety-alerts` |
| `workplace_safety_events` | DATASET | `urn:li:dataset:(urn:li:dataPlatform:humanos,workplace_safety_events,PROD)` | Safety Operations | `compliance`, `audit-trail` |
| `pose-processing-pipeline` | DATAFLOW | `urn:li:dataFlow:(humanos,pose-processing-pipeline,PROD)` | ML Platform Team | `pipeline`, `data-flow` |
| `workplace-safety-dashboard` | DASHBOARD | `urn:li:dashboard:(humanos,workplace-safety-dashboard)` | Safety Operations | `dashboard`, `monitoring` |

---

## 🛠️ DataHub Agent Tool Calling & Incident Write-Back

### 1. DataHub MCP / GMS Tool Calling
The agent executes live tool queries against DataHub GMS:
- `search_datahub("humanos-risk-v1")`: Finds registered ML model entity.
- `get_entity_metadata(urn)`: Retrieves model version (v2.1.0), accuracy (94%), F1-score (0.91), and limitations.
- `get_lineage(urn, direction="UPSTREAM")`: Traces 5-hop upstream lineage to `pose_landmarks`.
- `get_owners(urn)`: Resolves accountability to `HumanOS Safety Team (safety-team@humanos.ai)`.

### 2. Incident Write-Back (`POST /api/incident`)
When an investigation finishes, the agent emits a `MetadataChangeProposal` to DataHub:
```json
{
  "entityType": "dataset",
  "entityUrn": "urn:li:dataset:(urn:li:dataPlatform:humanos,incident_1770650666,PROD)",
  "aspect": {
    "description": "HumanOS Safety Incident - Risk Score: 78%",
    "customProperties": {
      "risk_score": "0.78",
      "trend": "increasing",
      "model_used": "humanos-risk-v1",
      "recommendation": "Pause worker and stabilize posture",
      "investigated_by": "HumanOS Sentinel Agent"
    }
  }
}
```

---

## 🔒 Privacy-First Computer Vision Boundary

```text
  WEBCAM FEED          MEDIAPIPE VISION          PRIVACY BOUNDARY           DATAHUB & AGENT
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│ Raw RGB      │ --> │ Extract 33 Body  │ --> │ DISCARD RAW      │ --> │ Numerical Landmarks  │
│ Optical Feed │     │ Joint Coordinates│     │ OPTICAL BUFFER   │     │ & Kinematic Features │
└──────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────────┘
```

1. **Client-Side Processing:** MediaPipe Pose Landmarker runs 100% in JavaScript via WebGL/WASM inside the user's browser.
2. **Zero Video Persistence:** Raw optical video frames exist only in volatile video element RAM during inference and are destroyed immediately.
3. **PII-Free Transmission:** Only 33 normalized float coordinates `(x, y, z)` are passed to kinematic feature calculation.

---

## 🎨 UI & Design System: White Royal Theme

- **Palette:** Crisp Pearl White (`#f8fafc`), Royal Sapphire Blue (`#0f2b5c`), Royal Gold (`#d4af37`), Royal Emerald (`#059669`), and Imperial Crimson (`#dc2626`).
- **Typography:** Google Fonts `Cinzel` (Royal Serif Titles) & `Plus Jakarta Sans` (Crisp Sans Body).
- **Royal Emblem Logo:** Custom SVG crest featuring shield boundary, Vitruvian kinematic skeleton, DataHub orbit rings, and emerald privacy core eye.

---

## 🚀 Step-by-Step Setup & Running Instructions

### Prerequisites
- **Node.js:** 16.0+
- **Python:** 3.10+
- **Docker & Docker Compose** (Optional for local DataHub instance)
- **Ollama:** Installed locally with `qwen2.5:7b` model

---

### Step 1: Install DataHub & Python Dependencies

```bash
# Clone the repository
git clone https://github.com/Varun072006/DataHub-Devpost.git
cd DataHub-Devpost

# Install Python backend dependencies
pip install fastapi uvicorn requests pydantic ollama acryl-datahub
```

---

### Step 2: Seed DataHub & Launch Backend Server

```bash
# Seed DataHub with HumanOS metadata graph & entities
python backend/seed_datahub.py

# Launch FastAPI Agent Backend Server
python backend/server.py
```
*Backend API runs at `http://localhost:8000` (Health Check: `http://localhost:8000/health`).*

---

### Step 3: Install Frontend & Start Vite Dev Server

In a second terminal window:

```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend interface opens automatically at `http://localhost:5179`.*

---

## 📁 Pre-Generated Sample Output Artifacts for Judging

Judges can inspect sample output JSON artifacts in the [`examples/`](./examples) folder without needing to execute code:

1. **[`examples/investigation_report.json`](./examples/investigation_report.json):** Full structured agent investigation output including physical evidence, DataHub lineage, model metrics, and action recommendations.
2. **[`examples/trust_verification.json`](./examples/trust_verification.json):** "Why Trust This Prediction?" audit checklist detailing lineage verification, PII compliance, and model limitations.
3. **[`examples/incident_writeback.json`](./examples/incident_writeback.json):** DataHub metadata proposal write-back result.

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vite + Vanilla JavaScript + CSS | Single-page high-performance web app |
| **Pose Engine** | `@mediapipe/tasks-vision` (CDN) | In-browser 3D skeleton joint extraction |
| **Styling** | Vanilla CSS with Custom Variables | White Royal Elegant glassmorphism theme |
| **Backend** | FastAPI (Python 3.10) + Uvicorn | REST API & agent backend orchestration |
| **LLM Agent** | Ollama (`qwen2.5:7b`) | Autonomous reasoning with tool calling |
| **DataHub Platform** | DataHub GMS REST & GraphQL APIs | Context graph, lineage, ownership & write-back |
| **Metadata Ingestion** | `acryl-datahub` Python SDK | Programmatic entity & proposal emission |

---

## 📄 License & Open Source Compliance

This project is licensed under the **Apache License 2.0**. See the [LICENSE](./LICENSE) file for complete details.

---

<div align="center">
  <sub>Built with ❤️ for <strong>Build with DataHub: The Agent Hackathon</strong></sub>
</div>
