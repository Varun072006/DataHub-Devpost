# 💡 DataHub Developer Experience Feedback & Suggestions

> **Submitted as part of the Build with DataHub: The Agent Hackathon**

---

## Executive Summary
While building **HumanOS Sentinel**, our team integrated the `acryl-datahub` Python SDK, GraphQL API, and REST Emitter endpoints. Overall, DataHub's context graph provided an unmatched foundation for agentic reasoning. Below are 3 actionable developer experience suggestions to make DataHub even more powerful for edge AI agents.

---

## 1. Native `MLModel` Lineage Helpers in Python SDK
- **Observation:** Setting up direct lineage between an `MLModel` entity (`urn:li:mlModel:...`) and an upstream feature `Dataset` required manual construction of `MetadataChangeProposalWrapper` aspects.
- **Recommendation:** Add a high-level `client.lineage.add_model_lineage(model_urn, upstream_dataset_urn)` helper to `acryl-datahub` SDK similar to the dataset-to-dataset helper.

---

## 2. Event-Driven MCP Webhook Subscriptions for Real-Time Agents
- **Observation:** For edge AI agents monitoring real-time sensor feeds, polling DataHub GraphQL can introduce slight latency.
- **Recommendation:** Introduce a lightweight SSE (Server-Sent Events) or WebSocket subscription endpoint on DataHub GMS for live aspect changes.

---

## 3. Pre-built Skill Schema for Safety & Governance Agents
- **Observation:** Agents performing auditability checks benefit from standardized trust check schemas.
- **Recommendation:** Standardize governance audit tags (e.g. `pii-boundary`, `edge-certified`, `model-accuracy-verified`) as official DataHub Glossary terms out of the box.

---

*Thank you to the Acryl Data and DataHub core team for building an incredible open-source context platform!*
