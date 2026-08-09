import json
import logging
import requests
from config import DATAHUB_GMS_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_datahub")

ENTITIES = [
    {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:humanos,pose_landmarks,PROD)",
        "name": "pose_landmarks",
        "description": "33 normalized 3D body landmark coordinates extracted in-browser via MediaPipe Task Vision. Privacy boundary: raw video is discarded.",
        "owner": "urn:li:corpuser:ml_platform_team",
        "tags": ["pii-free", "privacy-boundary", "real-time"]
    },
    {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:humanos,motion_features,PROD)",
        "name": "motion_features",
        "description": "Derived spatial-temporal kinematics: torso angle, knee joint flex angles, velocity displacement vector.",
        "owner": "urn:li:corpuser:ml_platform_team",
        "tags": ["kinematics", "features"]
    },
    {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:humanos,fall_risk_features,PROD)",
        "name": "fall_risk_features",
        "description": "Windowed aggregation of posture stability metrics, torso tilt variance, and center-of-mass jitter over rolling 10-second window.",
        "owner": "urn:li:corpuser:ml_platform_team",
        "tags": ["features", "windowed", "fall-risk"]
    },
    {
        "urn": "urn:li:mlModel:(urn:li:dataPlatform:humanos,humanos-posture-v1,PROD)",
        "name": "humanos-posture-v1",
        "description": "Base classification model categorizing static human posture into stable, leaning, unstable, or critical state.",
        "owner": "urn:li:corpuser:humanos_safety_team",
        "tags": ["ml-model", "posture-classifier"]
    },
    {
        "urn": "urn:li:mlModel:(urn:li:dataPlatform:humanos,humanos-risk-v1,PROD)",
        "name": "humanos-risk-v1",
        "description": "Primary biomechanical risk prediction model estimating probability of near-term posture instability and fall hazard.",
        "owner": "urn:li:corpuser:humanos_safety_team",
        "tags": ["ml-model", "risk-predictor", "safety-critical"]
    },
    {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:humanos,human_motion_events,PROD)",
        "name": "human_motion_events",
        "description": "Structured stream of high-risk posture events emitted when stability score drops below safe operating thresholds.",
        "owner": "urn:li:corpuser:humanos_safety_team",
        "tags": ["events", "safety-alerts"]
    },
    {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:humanos,workplace_safety_events,PROD)",
        "name": "workplace_safety_events",
        "description": "Organization-wide incident aggregation dataset logging safety interventions and agent recommendations.",
        "owner": "urn:li:corpuser:safety_operations",
        "tags": ["compliance", "audit-trail"]
    },
    {
        "urn": "urn:li:dataFlow:(humanos,pose-processing-pipeline,PROD)",
        "name": "pose-processing-pipeline",
        "description": "Real-time edge ingestion pipeline converting skeletal joint coordinates to feature vectors.",
        "owner": "urn:li:corpuser:ml_platform_team",
        "tags": ["pipeline", "data-flow"]
    },
    {
        "urn": "urn:li:dashboard:(humanos,workplace-safety-dashboard)",
        "name": "workplace-safety-dashboard",
        "description": "Executive & Operational dashboard displaying live ergonomic risk indices and active interventions.",
        "owner": "urn:li:corpuser:safety_operations",
        "tags": ["dashboard", "monitoring"]
    }
]

def seed_datahub():
    logger.info(f"Seeding DataHub GMS at {DATAHUB_GMS_URL}...")
    url = f"{DATAHUB_GMS_URL}/aspects?action=ingestProposal"
    
    success_count = 0
    for entity in ENTITIES:
        entity_type = "dataset"
        if "mlModel" in entity["urn"]:
            entity_type = "mlModel"
        elif "dashboard" in entity["urn"]:
            entity_type = "dashboard"
        elif "dataFlow" in entity["urn"]:
            entity_type = "dataFlow"
            
        mcp_payload = {
            "proposal": {
                "entityType": entity_type,
                "entityUrn": entity["urn"],
                "changeType": "UPSERT",
                "aspectName": "datasetProperties" if entity_type == "dataset" else "institutionalMemory",
                "aspect": {
                    "json": json.dumps({
                        "description": entity["description"],
                        "customProperties": {
                            "name": entity["name"],
                            "owner": entity["owner"],
                            "tags": ",".join(entity["tags"])
                        }
                    })
                }
            }
        }
        
        try:
            res = requests.post(url, json=mcp_payload, headers={"Content-Type": "application/json"}, timeout=4)
            if res.status_code == 200:
                success_count += 1
                logger.info(f"Ingested entity: {entity['name']} ({entity['urn']})")
            else:
                logger.warning(f"Response {res.status_code} for {entity['name']}")
        except Exception as e:
            logger.warning(f"Could not reach DataHub GMS REST API for {entity['name']}: {e}")
            
    logger.info(f"Seeding completed. Total ingested: {success_count}/{len(ENTITIES)}")

if __name__ == "__main__":
    seed_datahub()
