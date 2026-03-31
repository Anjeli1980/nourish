from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, date


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'nourish_db')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== DATA MODELS ====================

# User Profile Models
class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    gender: str  # male, female, other
    height: float  # in cm
    weight: float  # in kg
    activity_level: str  # sedentary, light, moderate, active, very_active
    goal: str  # lose_weight, maintain, gain_weight
    target_weight: Optional[float] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileCreate(BaseModel):
    name: str
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str
    goal: str
    target_weight: Optional[float] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    target_weight: Optional[float] = None

# Meal Models
class MealItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    meal_type: str  # breakfast, lunch, dinner, snack
    food_name: str
    calories: float
    protein: float
    carbs: float
    fats: float
    serving_size: str
    date: str  # YYYY-MM-DD format
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MealItemCreate(BaseModel):
    user_id: str
    meal_type: str
    food_name: str
    calories: float
    protein: float = 0
    carbs: float = 0
    fats: float = 0
    serving_size: str = "1 serving"
    date: Optional[str] = None

# Water Tracking Models
class WaterIntake(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount_ml: float
    date: str  # YYYY-MM-DD format
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WaterIntakeCreate(BaseModel):
    user_id: str
    amount_ml: float
    date: Optional[str] = None

# Weight Tracking Models
class WeightEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    weight: float
    date: str  # YYYY-MM-DD format
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WeightEntryCreate(BaseModel):
    user_id: str
    weight: float
    date: Optional[str] = None
    notes: Optional[str] = None


# ==================== HELPER FUNCTIONS ====================

def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
    if gender.lower() == "male":
        return (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        return (10 * weight) + (6.25 * height) - (5 * age) - 161

def calculate_tdee(bmr: float, activity_level: str) -> float:
    """Calculate Total Daily Energy Expenditure"""
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    return bmr * activity_multipliers.get(activity_level, 1.2)

def calculate_bmi(weight: float, height: float) -> float:
    """Calculate BMI (weight in kg, height in cm)"""
    height_m = height / 100
    return weight / (height_m ** 2)


# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Nourish Diet Planner API v1.0"}

# User Profile Routes
@api_router.post("/profile", response_model=UserProfile)
async def create_profile(profile: UserProfileCreate):
    profile_dict = profile.model_dump()
    profile_obj = UserProfile(**profile_dict)
    
    doc = profile_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.profiles.insert_one(doc)
    return profile_obj

@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    profile = await db.profiles.find_one({"id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if isinstance(profile.get('created_at'), str):
        profile['created_at'] = datetime.fromisoformat(profile['created_at'])
    if isinstance(profile.get('updated_at'), str):
        profile['updated_at'] = datetime.fromisoformat(profile['updated_at'])
    
    return profile

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, updates: UserProfileUpdate):
    update_dict = {k: v for k, v in updates.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.profiles.update_one(
        {"id": user_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return await get_profile(user_id)

@api_router.get("/profile/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get calculated stats for user"""
    profile = await db.profiles.find_one({"id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    bmr = calculate_bmr(profile['weight'], profile['height'], profile['age'], profile['gender'])
    tdee = calculate_tdee(bmr, profile['activity_level'])
    bmi = calculate_bmi(profile['weight'], profile['height'])
    
    # Calculate target calories based on goal
    if profile['goal'] == 'lose_weight':
        target_calories = tdee - 500  # 500 calorie deficit
    elif profile['goal'] == 'gain_weight':
        target_calories = tdee + 500  # 500 calorie surplus
    else:
        target_calories = tdee
    
    return {
        "bmr": round(bmr, 2),
        "tdee": round(tdee, 2),
        "bmi": round(bmi, 2),
        "target_calories": round(target_calories, 2),
        "current_weight": profile['weight'],
        "target_weight": profile.get('target_weight'),
        "height": profile['height']
    }

# Meal Tracking Routes
@api_router.post("/meals", response_model=MealItem)
async def log_meal(meal: MealItemCreate):
    meal_dict = meal.model_dump()
    if not meal_dict.get('date'):
        meal_dict['date'] = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    
    meal_obj = MealItem(**meal_dict)
    
    doc = meal_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.meals.insert_one(doc)
    return meal_obj

@api_router.get("/meals/{user_id}/{date}", response_model=List[MealItem])
async def get_meals_by_date(user_id: str, date: str):
    """Get all meals for a specific date"""
    meals = await db.meals.find(
        {"user_id": user_id, "date": date},
        {"_id": 0}
    ).to_list(1000)
    
    for meal in meals:
        if isinstance(meal.get('created_at'), str):
            meal['created_at'] = datetime.fromisoformat(meal['created_at'])
    
    return meals

@api_router.get("/meals/{user_id}/{date}/summary")
async def get_daily_summary(user_id: str, date: str):
    """Get nutrition summary for a day"""
    meals = await db.meals.find(
        {"user_id": user_id, "date": date},
        {"_id": 0}
    ).to_list(1000)
    
    total_calories = sum(m['calories'] for m in meals)
    total_protein = sum(m['protein'] for m in meals)
    total_carbs = sum(m['carbs'] for m in meals)
    total_fats = sum(m['fats'] for m in meals)
    
    # Get meals by type
    meals_by_type = {
        "breakfast": [m for m in meals if m['meal_type'] == 'breakfast'],
        "lunch": [m for m in meals if m['meal_type'] == 'lunch'],
        "dinner": [m for m in meals if m['meal_type'] == 'dinner'],
        "snack": [m for m in meals if m['meal_type'] == 'snack']
    }
    
    return {
        "date": date,
        "total_calories": round(total_calories, 2),
        "total_protein": round(total_protein, 2),
        "total_carbs": round(total_carbs, 2),
        "total_fats": round(total_fats, 2),
        "meals_by_type": meals_by_type,
        "meal_count": len(meals)
    }

@api_router.delete("/meals/{meal_id}")
async def delete_meal(meal_id: str):
    result = await db.meals.delete_one({"id": meal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meal not found")
    return {"message": "Meal deleted successfully"}

# Water Tracking Routes
@api_router.post("/water", response_model=WaterIntake)
async def log_water(water: WaterIntakeCreate):
    water_dict = water.model_dump()
    if not water_dict.get('date'):
        water_dict['date'] = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    
    water_obj = WaterIntake(**water_dict)
    
    doc = water_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.water.insert_one(doc)
    return water_obj

@api_router.get("/water/{user_id}/{date}")
async def get_water_intake(user_id: str, date: str):
    """Get total water intake for a day"""
    water_entries = await db.water.find(
        {"user_id": user_id, "date": date},
        {"_id": 0}
    ).to_list(1000)
    
    total_ml = sum(w['amount_ml'] for w in water_entries)
    
    return {
        "date": date,
        "total_ml": round(total_ml, 2),
        "total_liters": round(total_ml / 1000, 2),
        "entries": len(water_entries),
        "goal_ml": 2000,  # 2 liters recommended
        "percentage": round((total_ml / 2000) * 100, 2)
    }

# Weight Tracking Routes
@api_router.post("/weight", response_model=WeightEntry)
async def log_weight(weight: WeightEntryCreate):
    weight_dict = weight.model_dump()
    if not weight_dict.get('date'):
        weight_dict['date'] = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    
    weight_obj = WeightEntry(**weight_dict)
    
    doc = weight_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.weight_entries.insert_one(doc)
    
    # Update user profile with latest weight
    await db.profiles.update_one(
        {"id": weight_dict['user_id']},
        {"$set": {"weight": weight_dict['weight'], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return weight_obj

@api_router.get("/weight/{user_id}/history", response_model=List[WeightEntry])
async def get_weight_history(user_id: str, limit: int = 30):
    """Get weight history for a user"""
    entries = await db.weight_entries.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("date", -1).limit(limit).to_list(limit)
    
    for entry in entries:
        if isinstance(entry.get('created_at'), str):
            entry['created_at'] = datetime.fromisoformat(entry['created_at'])
    
    return entries


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()