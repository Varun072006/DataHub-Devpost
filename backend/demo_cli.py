#!/usr/bin/env python3
"""
HumanOS Sentinel — Headless CLI Demo Runner
Allows judges to test the full agent investigation & DataHub write-back in terminal mode.
"""

import sys
import os
import json

# Add backend dir to path
sys.path.insert(0, os.path.dirname(__file__))

from agent import run_agent_investigation, run_trust_verification

def main():
    print("=" * 70)
    print("🛡️  HUMANOS SENTINEL — HEADLESS AGENT INVESTIGATION DEMO")
    print("=" * 70)
    
    sample_state = {
        "posture": "unstable",
        "stability": 0.31,
        "risk": 0.78,
        "trend": "increasing",
        "torsoAngle": 23.0,
        "kneeAngle": {"left": 142.0, "right": 138.0},
        "movementVelocity": 0.12
    }
    
    print("\n[1/3] Simulating High-Risk Motion Event Snapshot:")
    print(json.dumps(sample_state, indent=2))
    
    print("\n[2/3] Triggering Ollama LLM Agent + DataHub Context Graph Reasoning...")
    report = run_agent_investigation(sample_state)
    
    print("\n[3/3] Investigation Results & DataHub Write-Back:")
    print("-" * 70)
    print(f"Status:          {report['status']}")
    print(f"Risk Index:      {report['riskScore']*100:.0f}% ({report['trend'].upper()})")
    print(f"Responsible ML:  {report['model']['name']} (v{report['model']['version']})")
    print(f"Model Owner:     {report['model']['owner']}")
    print(f"Data Lineage:    " + " -> ".join([n['name'] for n in report['lineageChain']]))
    print(f"Recommendation:  {report['recommendation']}")
    print(f"Incident URN:    {report['writeback']['urn']}")
    print("-" * 70)
    print("\n✓ SUCCESS: Headless agent investigation completed & written back to DataHub.\n")

if __name__ == "__main__":
    main()
