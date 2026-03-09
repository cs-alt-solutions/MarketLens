import os
import random
import uvicorn # <-- Added this for FastAPI
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any # <-- Added Dict and Any for JSONB columns

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

# ==========================================
# 4. DATA MODELS (The Gatekeepers)
# These perfectly match our new Supabase SQL Architecture
# ==========================================

class AnalysisRequest(BaseModel):
    query: str

class ProjectBase(BaseModel):
    title: str
    status: Optional[str] = "idea"
    stockQty: Optional[int] = 0
    soldQty: Optional[int] = 0
    retailPrice: Optional[float] = 0.0
    # Using List[Dict] and Dict allows Python to validate dynamic JSON data
    recipe: Optional[List[Dict[str, Any]]] = []
    economics: Optional[Dict[str, Any]] = {}

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None

# ==========================================
# --- THE BRAIN: CEREBRUM MATH ENGINE ---
# ==========================================

def normalize_units(amount, unit):
    if not unit: return amount
    unit = str(unit).lower().strip()
    
    # Weight (Base: grams)
    if unit in ['lb', 'lbs', 'pound', 'pounds']: return amount * 453.592
    if unit in ['oz', 'ounce', 'ounces']: return amount * 28.3495
    if unit in ['kg', 'kilogram', 'kilograms']: return amount * 1000
    if unit in ['g', 'gram', 'grams']: return amount
        
    # Length (Base: cm)
    if unit in ['m', 'meter', 'meters']: return amount * 100
    if unit in ['in', 'inch', 'inches']: return amount * 2.54
    if unit in ['ft', 'foot', 'feet']: return amount * 30.48

    # Volume (Base: ml)
    if unit in ['gal', 'gallon', 'gallons']: return amount * 3785.41
    if unit in ['fl oz', 'fluid ounce', 'fluid ounces']: return amount * 29.5735
    if unit in ['ml', 'milliliter', 'milliliters']: return amount

    return amount

def calculate_material_cost(purchase_price, purchase_amount, purchase_unit, recipe_amount, recipe_unit):
    try:
        total_base_bought = normalize_units(purchase_amount, purchase_unit)
        base_used = normalize_units(recipe_amount, recipe_unit)
        cost_per_base = purchase_price / total_base_bought
        return round(cost_per_base * base_used, 2)
    except (ZeroDivisionError, TypeError):
        return 0.0

# ==========================================
# 5. The Endpoints (The Actions)
# ==========================================

@app.get("/")
def read_root():
    return {"status": "Alternative Solutions API is running 🟢"}

@app.get("/api/projects")
def get_projects():
    try:
        response = supabase.table("projects").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects")
def create_project(project: ProjectCreate):
    """
    New Endpoint: Allows the backend to safely receive and validate 
    project data (including JSON arrays) before saving to Supabase.
    """
    try:
        data = supabase.table("projects").insert(project.dict()).execute()
        print("✅ Project Saved to Database!")
        return data.data[0]
    except Exception as e:
        print(f"❌ Database Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
def analyze_market(request: AnalysisRequest):
    print(f"🔎 Analyzing: {request.query}")
    
    # --- SIMULATION LOGIC ---
    demand = random.randint(20, 100)
    competition = random.choice(["Low", "Medium", "High", "Very High"])
    profit = round(random.uniform(5.00, 50.00), 2)

    new_project = {
        "title": request.query, # Updated to match our new SQL schema 'title' instead of 'name'
        "status": "draft",
        "economics": {
            "demand_score": demand,
            "competition_score": competition,
            "profit_estimate": profit,
            "source": "Simulation"
        }
    }

    if supabase:
        try:
            data = supabase.table("projects").insert(new_project).execute()
            print("✅ Saved to Database!")
            return data.data[0] 
        except Exception as e:
            print(f"❌ Database Error: {e}")
            return new_project 
    
    return new_project

# --- CEREBRUM MATH ENDPOINTS ---

@app.post("/api/engine/calculate-cost")
async def get_cost(request: Request):
    data = await request.json()
    result = calculate_material_cost(
        data.get('price', 0),
        data.get('buy_qty', 1), 
        data.get('buy_unit', 'ea'),
        data.get('use_qty', 0),
        data.get('use_unit', 'ea')
    )
    return {"engine_cost": result}

@app.post("/api/engine/analyze-finances")
async def analyze_finances(request: Request):
    data = await request.json()
    transactions = data.get('transactions', [])
    
    total_income = sum(float(tx['amount']) for tx in transactions if tx['type'] in ['SALE', 'INCOME'])
    total_expense = sum(abs(float(tx['amount'])) for tx in transactions if tx['type'] == 'EXPENSE')
    
    return {
        "engine_total_income": round(total_income, 2),
        "engine_total_expense": round(total_expense, 2),
        "engine_net_profit": round(total_income - total_expense, 2)
    }

# ==========================================
# 6. Server Execution (FastAPI Standard)
# ==========================================
if __name__ == "__main__":
    # This replaces the old Flask app.run() and allows you to run the file directly
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)