from sentence_transformers import SentenceTransformer
from config.Env import ENVConfig

model = SentenceTransformer(ENVConfig.EMBEDDING_MODEL)

import requests

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "nomic-embed-text"

def embed(texts: list[str]) -> list[list[float]]:
    embeddings = []

    for text in texts:
        r = requests.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={
                "model": EMBED_MODEL,
                "prompt": text
            },
            timeout=30
        )
        r.raise_for_status()
        embeddings.append(r.json()["embedding"])

    return embeddings
