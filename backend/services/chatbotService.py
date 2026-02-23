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
        Chỉ tư vấn thông tin về sản phẩm có trong cửa hàng, không tư vấn sản phẩm ngoài cửa hàng. 

        Nếu khách hỏi về cách đặt hàng, hãy hướng dẫn khách hàng cách đặt hàng qua website hoặc app của cửa hàng. 
        Nếu khách hỏi về chính sách đổi trả, hãy báo cho khách gọi đến trung tâm chăm sóc khách hàng hoặc nhắn tin đến Zalo.
        Hệ thống chưa có chức năng thanh toán trực tuyến qua các cổng thanh toán nên gợi ý khách mua hàng trực tiếp tại cửa hàng để nhận được nhiều ưu đãi.
        
        Hãy tư vấn ngắn gọn, thân thiện và thực tế.
    """