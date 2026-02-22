from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=ENV_PATH)

class ENVConfig:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SECRET_KEY = os.getenv("SECRET_KEY","")

    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_NAME = os.getenv("CLOUDINARY_NAME", "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")

    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "")
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

    VIETTEL_POST_BASE_URL = os.getenv("VIETTEL_POST_BASE_URL", "https://partner.viettelpost.vn")
    VIETTEL_POST_TOKEN = os.getenv("VIETTEL_POST_TOKEN", "")

    MOMO_QR_IMAGE_URL = os.getenv("MOMO_QR_IMAGE_URL", "")
    MOMO_RECEIVER_NAME = os.getenv("MOMO_RECEIVER_NAME", "")
    MOMO_RECEIVER_PHONE = os.getenv("MOMO_RECEIVER_PHONE", "")