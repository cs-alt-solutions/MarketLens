import os
import requests
from dotenv import load_dotenv

# Load the secrets from the .env file
load_dotenv()

API_KEY = os.getenv("ETSY_KEYSTRING")

def search_listings(self, query):
        if not self.api_key:
            return {"error": "Etsy API key not configured"}
            
        url = "https://openapi.etsy.com/v3/application/listings/active"
        headers = {"x-api-key": self.api_key}
        params = {"keywords": query}
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4xx, 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Etsy API Error: {e}")
            # Return a graceful error structure instead of crashing
            return {"error": "Failed to fetch listings from Etsy", "details": str(e)}