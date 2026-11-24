import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SECRET_KEY"]
)

response = supabase.table("medical_documents").select("id").limit(1).execute()

print("Supabase connected successfully!")
print(response.data)