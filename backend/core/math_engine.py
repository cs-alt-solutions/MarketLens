# math_engine.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Shift Studio: Cerebrum")

# --- ARCHITECTURE: THE SECURITY GATE ---
# This allows your React App (Vite) to talk to this Python service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE BRAIN: UNIT NORMALIZATION ---
def normalize_units(amount, unit):
    unit = unit.lower().strip()
    
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

    # Default (BF / Count / Each)
    return amount

# --- THE LOGIC: COST CALCULATION ---
def calculate_material_cost(purchase_price, purchase_amount, purchase_unit, recipe_amount, recipe_unit):
    try:
        total_base_bought = normalize_units(purchase_amount, purchase_unit)
        base_used = normalize_units(recipe_amount, recipe_unit)
        cost_per_base = purchase_price / total_base_bought
        return round(cost_per_base * base_used, 2)
    except (ZeroDivisionError, TypeError):
        return 0.0

# --- THE API: ENDPOINTS ---

@app.get("/api/health")
async def health_check():
    """Verify the brain is online."""
    return {"status": "CEREBRUM_ONLINE", "version": "2.0.0"}

@app.post("/api/engine/calculate-cost")
async def get_cost(request: Request):
    """
    Expects JSON: 
    { "price": 20, "buy_qty": 5, "buy_unit": "lbs", "use_qty": 4, "use_unit": "oz" }
    """
    data = await request.json()
    result = calculate_material_cost(
        data.get('price', 0),
        data.get('buy_qty', 0),
        data.get('buy_unit', 'ea'),
        data.get('use_qty', 0),
        data.get('use_unit', 'ea')
    )
    return {"engine_cost": result}

@app.post("/api/engine/analyze-finances")
async def analyze_finances(request: Request):
    """Processes bulk records to return engine metrics."""
    data = await request.json()
    transactions = data.get('transactions', [])
    recurring = data.get('recurring', [])
    
    total_income = sum(float(tx['amount']) for tx in transactions if tx['type'] in ['SALE', 'INCOME'])
    total_expense = sum(abs(float(tx['amount'])) for tx in transactions if tx['type'] == 'EXPENSE')
    
    return {
        "engine_total_income": round(total_income, 2),
        "engine_total_expense": round(total_expense, 2),
        "engine_net_profit": round(total_income - total_expense, 2)
    }

if __name__ == "__main__":
    # Launch the server
    uvicorn.run(app, host="0.0.0.0", port=8000)