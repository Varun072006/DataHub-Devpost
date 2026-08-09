# 🛡️ HumanOS Sentinel

> **Privacy-First Human Risk Intelligence & DataHub Governed AI Agent**
>
> *An AI agent that observes human pose dynamics, detects ergonomic/fall risk, traces lineage through DataHub's context graph, explains predictions, and writes safety incident knowledge back.*

---

## 🏆 Hackathon Project Highlights

- **Challenge Category:** Open / Wildcard & Production ML Agents
- **License:** Apache 2.0 (See [LICENSE](./LICENSE))
- **DataHub Integration:** Real DataHub instance (`datahub docker quickstart`) + GMS GraphQL & REST APIs + Metadata Ingestion SDK + Incident Write-back
- **Local LLM Agent:** Powered by Ollama (`qwen2.5:7b`) with tool calling over DataHub context graph
- **Privacy Boundary:** Computer vision pose extraction runs 100% in-browser via MediaPipe Tasks Vision. Raw video frames are discarded locally and never leave the client device.

---

## 🌟 The Core Story: Observe → Understand → Trace → Explain → Act

Existing computer vision systems tell you *what* a person is doing (e.g. "person sitting"). **HumanOS Sentinel** asks a more critical question:

> *"What is happening to their biomechanical physical state, what ML model produced this risk score, can we trust its data lineage through DataHub, and what corrective action should be taken?"*

---

## 📐 System Architecture

```text
               +----------------------------------+
               |          BROWSER (Vite)          |
               |  Webcam -> MediaPipe Pose        |
               |  Raw frame discarded at boundary |
               |  HumanState Risk Engine          |
               +----------------+-----------------+
                                |
                   HumanState   |   HTTP API
                    (JSON)      v
               +----------------+-----------------+
               |         FastAPI Backend          |
               |     (http://localhost:8000)      |
               +-------+------------------+-------+
                       |                  |
        Ollama         |                  |  DataHub REST / GraphQL
    (qwen2.5:7b)       v                  v
               +-------+--------+  +------+-------+
               |  Ollama LLM    |  |   DataHub    |
               |  Reasoning     |  | (Docker GMS) |
               |  & Tool Call   |  | :8080 / :9002|
               +----------------+  +--------------+
                                          ^
                                          | Write-Back Incident
                                          +-------------------
```

---

## 🔗 DataHub Context Graph Lineage

HumanOS Sentinel populates and queries a 5-level end-to-end metadata lineage chain inside DataHub:

```text
[pose_landmarks] (Dataset - ML Platform Team)
       ↓
[motion_features] (Dataset - ML Platform Team)
       ↓
[fall_risk_features] (Dataset - ML Platform Team)
       ↓
[humanos-risk-v1] (ML Model - HumanOS Safety Team)
       ↓
[human_motion_events] (Dataset - HumanOS Safety Team)
       ↓
[workplace-safety-dashboard] (Dashboard - Safety Operations)
```

### ✍️ Agent Write-Back Capability
When a high-risk event is flagged and investigated, the Sentinel Agent programmatically creates a **Safety Incident Entity** in DataHub's metadata graph (`urn:li:dataset:(urn:li:dataPlatform:humanos,incident_<timestamp>,PROD)`) containing root-cause analysis, risk metrics, and recommended interventions.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+
- Python 3.10+
- Docker & Docker Compose (for running DataHub)
- Ollama (running locally with `qwen2.5:7b`)

---

### Step 1: Start DataHub (Local Quickstart)

```bash
pip install acryl-datahub
datahub docker quickstart
```
*DataHub Web UI will open at `http://localhost:9002`.*

---

### Step 2: Set Up & Seed Backend

```bash
cd backend
pip install -r requirements.txt

# Seed DataHub with HumanOS entities & lineage graph
python seed_datahub.py

# Start FastAPI Agent Backend
python server.py
```
*Backend API runs at `http://localhost:8000`.*

---

### Step 3: Set Up & Launch Frontend

In a new terminal window:

```bash
npm install
npm run dev
```
*Frontend interface will launch automatically at `http://localhost:5179`.*

---

## 📁 Repository Structure

```text
humanos-sentinel/
├── index.html              # Main web UI
├── style.css               # Glassmorphism dark mode CSS
├── vite.config.js          # Vite config (port 5179)
├── package.json            # Frontend package manifest
├── LICENSE                 # Apache 2.0 License
├── README.md               # Documentation & setup guide
│
├── js/                     # Frontend Modules
│   ├── main.js             # Application bootstrap
│   ├── pose.js             # MediaPipe pose pipeline & canvas drawing
│   ├── features.js         # Joint kinematics & stability math
│   ├── risk.js             # Rolling 10s HumanState engine
│   ├── ui.js               # Dashboard & modal rendering
│   └── api.js              # API client to FastAPI
│
├── backend/                # Agent Backend
│   ├── config.py           # Endpoint & model settings
│   ├── datahub_tools.py    # DataHub REST/GraphQL tool functions
│   ├── seed_datahub.py     # Metadata ingestion script
│   ├── agent.py            # Ollama tool-calling LLM agent
│   ├── server.py           # FastAPI application
│   └── requirements.txt    # Python dependencies
│
└── examples/               # Sample Output Artifacts (for judging)
    ├── investigation_report.json
    ├── trust_verification.json
    └── incident_writeback.json
```

---

## 📊 Sample Output Files
Judges can examine pre-generated outputs in the [`examples/`](./examples) directory:
- [`examples/investigation_report.json`](./examples/investigation_report.json)
- [`examples/trust_verification.json`](./examples/trust_verification.json)
- [`examples/incident_writeback.json`](./examples/incident_writeback.json)

---

## 🔒 Privacy & Ethical Governance
HumanOS Sentinel strictly enforces privacy at the edge:
1. Video frames stay inside the client browser.
2. MediaPipe Task Vision extracts 33 spatial landmarks.
3. Raw video buffer is immediately garbage-collected.
4. Downstream pipelines receive only anonymized numerical joint coordinates.
# DataHub-Devpost
