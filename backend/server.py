import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

from agent import run_agent_investigation, run_trust_verification
from datahub_tools import create_incident_in_datahub
from seed_datahub import seed_datahub

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server")

app = FastAPI(
    title="HumanOS Sentinel API",
    description="Agentic human-risk intelligence backend integrated with real DataHub platform.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HumanStateInput(BaseModel):
    posture: Optional[str] = "unstable"
    stability: Optional[float] = 0.31
    risk: Optional[float] = 0.78
    trend: Optional[str] = "increasing"
    torsoAngle: Optional[float] = 23.0
    kneeAngle: Optional[Dict[str, float]] = {"left": 142.0, "right": 138.0}
    movementVelocity: Optional[float] = 0.12

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "HumanOS Sentinel Agent Backend"}

@app.post("/api/investigate")
def investigate_endpoint(state: HumanStateInput):
    """Triggers agent investigation of a live HumanOS motion event."""
    try:
        report = run_agent_investigation(state.model_dump())
        return report
    except Exception as e:
        logger.error(f"Error during investigation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trust")
def trust_endpoint(state: HumanStateInput):
    """Runs trust verification check against DataHub context graph."""
    try:
        verification = run_trust_verification(state.model_dump())
        return verification
    except Exception as e:
        logger.error(f"Error during trust check: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/incident")
def incident_endpoint(data: Dict[str, Any]):
    """Explicitly creates a Safety Incident record in DataHub graph."""
    try:
        res = create_incident_in_datahub(data.get("report", {}))
        return res
    except Exception as e:
        logger.error(f"Error writing incident: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/seed")
def seed_endpoint():
    """Trigger DataHub seeding programmatically."""
    try:
        seed_datahub()
        return {"status": "success", "message": "DataHub entities seeded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
