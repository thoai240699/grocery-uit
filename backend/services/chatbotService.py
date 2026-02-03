from services.embeddingService import embed
from services.faissService import search
from services.llmService import call_qwen

def chat(query: str):
    q_vec = embed([query])[0]
    docs = search(q_vec)

    context = "\n".join([
        f"{d['name']} - {d['price']}đ - {d['category']}"
        for d in docs
    ])

    prompt = build_prompt(context, query)
    return call_qwen(prompt)

def build_prompt(context: str, query: str) -> str:
    return f"""
        Bạn là trợ lý bán hàng của cửa hàng tiện lợi MyKonbini.

        Sản phẩm liên quan:
        {context}

        Khách hỏi:
        {query}

        Hãy tư vấn ngắn gọn, thân thiện và thực tế.
    """