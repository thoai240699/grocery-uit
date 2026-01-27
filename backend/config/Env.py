from dotenv import load_dotenv
import os
load_dotenv()

class ENVConfig:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SECRET_KEY = os.getenv("SECRET_KEY","")

    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_NAME = os.getenv("CLOUDINARY_NAME", "")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")