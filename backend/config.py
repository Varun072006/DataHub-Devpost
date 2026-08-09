import os

DATAHUB_GMS_URL = os.getenv("DATAHUB_GMS_URL", "http://localhost:8080")
DATAHUB_FRONTEND_URL = os.getenv("DATAHUB_FRONTEND_URL", "http://localhost:9002")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
