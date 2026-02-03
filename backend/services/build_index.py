from services.productServices import get_products
from services.embeddingService import embed
from services.faissService import save_faiss_index

import requests

PRODUCT_API_URL = "http://127.0.0.1:8000/api/v1/products/"

def fetch_products():
    r = requests.get(PRODUCT_API_URL, timeout=10)
    r.raise_for_status()
    return r.json()["items"]

def build_index():
    products = fetch_products()

    texts = []
    metadatas = []

    for p in products:
        category_name = p["category"]["name"]

        # -------- Text dùng để vector hoá --------
        text = (
            f"{p['name']}. "
            f"Thuộc danh mục {category_name}. "
            f"Giá {p['price']} đồng. "
            f"{'Còn hàng' if p['stock'] > 0 else 'Hết hàng'}."
        )

        texts.append(text)

        # -------- Metadata để trả kết quả --------
        metadatas.append({
            "id": p["id"],
            "name": p["name"],
            "price": p["price"],
            "stock": p["stock"],
            "category": category_name,
            "category_slug": p["category"]["slug"]
        })

    embeddings = embed(texts)

    save_faiss_index(embeddings, metadatas)

    print(f"✅ Indexed {len(texts)} products")

if __name__ == "__main__":
    build_index()
