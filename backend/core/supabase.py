from app.core.config import settings
from supabase import create_client, Client

supabaseUrl = settings.SUPABASE_URL
supabaseKey = settings.SUPABASE_KEY

supabase: Client = create_client(supabaseUrl, supabaseKey)