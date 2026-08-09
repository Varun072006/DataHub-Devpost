---
name: humanos-sentinel-skill
description: Investigates high-risk human kinematics, verifies ML model lineage, and writes safety incident records back to DataHub.
version: 1.0.0
author: HumanOS Team
---

# HumanOS Sentinel — DataHub Agent Skill

## Overview
This DataHub Skill enables AI agents to query, audit, and emit biomechanical motion state incidents using DataHub's context graph.

## Capability Matrix
- **Metadata Discovery:** Resolves ML model URNs (`humanos-risk-v1`), model accuracy metrics, and maintainer ownership.
- **Lineage Traversal:** Traces 5-level upstream/downstream data flow from raw pose landmark sensors to workplace safety dashboards.
- **Privacy Audit:** Verifies edge-privacy compliance (zero optical frame persistence).
- **Incident Write-Back:** Emits `MetadataChangeProposal` aspects creating `Safety Incident` dataset entities in DataHub.

## Supported DataHub Tools
- `search_datahub(query)`
- `get_entity_metadata(urn)`
- `get_lineage(urn, direction)`
- `get_owners(urn)`
- `create_incident_in_datahub(report_data)`
