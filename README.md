backend:
    fastapi dev app.py

    Nếu dùng uvicorn: 
        source venv/bin/activate
        uvicorn app:app --reload

frontend:
    npm run dev

chat bot:
    brew install ollama     # macOS
    ollama serve            # run ollama service, or brew services start ollama
    http://localhost:11434  # http://localhost:11434
    ollama pull qwen3:4b    # pull model
    ollama pull nomic-embed-text
    ollama list             # check health
    python -m app.services.build_index  # build index

update requirements:
    pip install -r requirements.txt
    hoặc python -m pip install -r requirements.txt

    
