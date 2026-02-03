import faiss
import json
import numpy as np
import os
from typing import List, Dict

# =====================
# Paths
# =====================
VECTOR_DB_DIR = "vector_db"
INDEX_PATH = os.path.join(VECTOR_DB_DIR, "products.faiss")
MAP_PATH = os.path.join(VECTOR_DB_DIR, "products_map.json")

# =====================
# Global cache (load 1 lần)
# =====================
_index = None
_metadata: List[Dict] | None = None


# =====================
# Load FAISS + metadata
# =====================
def load_faiss():
    """
    Load FAISS index và metadata vào RAM (chỉ 1 lần)
    """
    global _index, _metadata

    if _index is None:
        if not os.path.exists(INDEX_PATH):
            raise FileNotFoundError(
                "❌ FAISS index chưa tồn tại. Hãy chạy build_index trước."
            )

        _index = faiss.read_index(INDEX_PATH)

    if _metadata is None:
        if not os.path.exists(MAP_PATH):
            raise FileNotFoundError(
                "❌ Metadata mapping chưa tồn tại."
            )

        with open(MAP_PATH, "r", encoding="utf-8") as f:
            _metadata = json.load(f)


# =====================
# Save FAISS index
# =====================
def save_faiss_index(vectors: np.ndarray, metadatas: List[Dict]):
    """
    Build & save FAISS index + metadata (offline)

    vectors: numpy array shape (N, D)
    metadatas: list metadata (N phần tử)
    """

    if len(vectors) == 0:
        raise ValueError("Vectors rỗng, không thể build FAISS index")

    if len(vectors) != len(metadatas):
        raise ValueError("Số vector và metadata không khớp")

    os.makedirs(VECTOR_DB_DIR, exist_ok=True)

    # FAISS yêu cầu float32
    vectors = np.array(vectors).astype("float32")

    dim = vectors.shape[1]

    # Index cơ bản (L2 distance)
    index = faiss.IndexFlatL2(dim)
    index.add(vectors)

    # Save index
    faiss.write_index(index, INDEX_PATH)

    # Save metadata (list, KHÔNG dùng dict key string)
    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(metadatas, f, ensure_ascii=False, indent=2)

    print(f"✅ FAISS index saved: {INDEX_PATH}")
    print(f"📦 Total vectors indexed: {index.ntotal}")


# =====================
# Search
# =====================
def search(query_vec: np.ndarray, k: int = 3) -> List[Dict]:
    """
    Search top-k vector gần nhất

    query_vec: vector của câu hỏi (1D)
    k: số kết quả trả về
    """

    load_faiss()

    query_vec = np.array([query_vec]).astype("float32")

    distances, indices = _index.search(query_vec, k)

    results = []
    for idx in indices[0]:
        if idx == -1:
            continue
        results.append(_metadata[idx])

    return results
