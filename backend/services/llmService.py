import requests
from config.Env import ENVConfig

def call_qwen(prompt: str) -> str:
    res = requests.post(
        ENVConfig.OLLAMA_URL,
        json={
            "model": "qwen3-4b",
            "prompt": prompt,
            "stream": False
        }
    )
    return res.json()["response"]