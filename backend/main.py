import os
import random
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. Load Keys
load_dotenv()

# 2. Setup Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("❌ WARNING: Supabase keys missing! App running in simulation mode.")
    supabase = None
else:
    print("✅ Supabase Credentials Loaded")
    supabase: Client = create_client(url, key)

app = FastAPI()

# --- Keep your CORS and classes below this ---
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ItemQuery(BaseModel):
    query: str
# ---------------------------------------------