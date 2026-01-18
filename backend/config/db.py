from config.Env import ENVConfig
from supabase import create_client, Client

client: Client = create_client(ENVConfig.SUPABASE_URL, ENVConfig.SUPABASE_KEY)


