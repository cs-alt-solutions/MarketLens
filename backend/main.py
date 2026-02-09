import os
import random
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# 1. Load Secrets
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# 2. Connect to Database
if not url or not key:
    print("❌ ERROR: Supabase keys not found. Check your .env file!")
    supabase = None
else:
    print("✅ Supabase Credentials Loaded")
    supabase: Client = create_client(url, key)

app = FastAPI()

# 3. Allow Frontend to Talk to Backend
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Define Data Models
class AnalysisRequest(BaseModel):
    query: str

# 5. The Endpoints (The Actions)

@app.get("/")
def read_root():
    return {"status": "MarketLens API is running 🟢"}

@app.get("/api/projects")
def get_projects():
    try:
        # Query the 'projects' table in Supabase
        response = supabase.table("projects").select("*").execute()
        return response.data
    except Exception as e:
        # Fallback to empty list or raise detailed HTTP error if DB fails
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
def analyze_market(request: AnalysisRequest):
    """
    1. Receive a search term.
    2. Simulate data (Math Engine).
    3. SAVE it to Supabase (Memory).
    """
    print(f"🔎 Analyzing: {request.query}")
    
    # --- SIMULATION LOGIC (Placeholder for Etsy API) ---
    demand = random.randint(20, 100)
    competition = random.choice(["Low", "Medium", "High", "Very High"])
    profit = round(random.uniform(5.00, 50.00), 2)
    # ---------------------------------------------------

    # Prepare the data for the Vault
    new_project = {
        "name": request.query,
        "status": "draft",
        "demand_score": demand,
        "competition_score": competition,
        "profit_estimate": profit,
        "source": "Simulation"
    }

    # Save to Supabase
    if supabase:
        try:
            data = supabase.table("projects").insert(new_project).execute()
            print("✅ Saved to Database!")
            return data.data[0] # Return the saved row
        except Exception as e:
            print(f"❌ Database Error: {e}")
            return new_project # Fallback if DB fails
    
    return new_project