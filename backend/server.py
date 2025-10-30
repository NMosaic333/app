from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Loan Applications
class LoanApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    amount: float
    term_months: int
    certificate_hash: str
    status: str = Field(default="PENDING")  # PENDING | APPROVED | REJECTED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoanApplicationCreate(BaseModel):
    wallet_address: str
    amount: float
    term_months: int
    certificate_hash: str

class LoanApplicationUpdate(BaseModel):
    status: Optional[str] = None
    certificate_hash: Optional[str] = None


# Health/root
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Loan application endpoints
@api_router.post("/loans", response_model=LoanApplication)
async def create_loan(input: LoanApplicationCreate):
    app_obj = LoanApplication(**input.model_dump())
    doc = app_obj.model_dump()
    # serialize datetimes
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.loan_applications.insert_one(doc)
    return app_obj

@api_router.get("/loans", response_model=List[LoanApplication])
async def list_loans(wallet_address: Optional[str] = Query(default=None)):
    query = {}
    if wallet_address:
        query['wallet_address'] = wallet_address
    items = await db.loan_applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        # back to datetime
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
        if isinstance(it.get('updated_at'), str):
            it['updated_at'] = datetime.fromisoformat(it['updated_at'])
    return items

@api_router.get("/loans/{loan_id}", response_model=LoanApplication)
async def get_loan(loan_id: str):
    it = await db.loan_applications.find_one({"id": loan_id}, {"_id": 0})
    if not it:
        raise HTTPException(status_code=404, detail="Loan not found")
    # convert datetime strings
    if isinstance(it.get('created_at'), str):
        it['created_at'] = datetime.fromisoformat(it['created_at'])
    if isinstance(it.get('updated_at'), str):
        it['updated_at'] = datetime.fromisoformat(it['updated_at'])
    return LoanApplication(**it)

@api_router.patch("/loans/{loan_id}", response_model=LoanApplication)
async def update_loan(loan_id: str, input: LoanApplicationUpdate):
    updates = {k: v for k, v in input.model_dump().items() if v is not None}
    updates['updated_at'] = datetime.now(timezone.utc).isoformat()
    res = await db.loan_applications.find_one_and_update(
        {"id": loan_id},
        {"$set": updates},
        projection={"_id": 0},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Loan not found")
    # fix datetime types
    if isinstance(res.get('created_at'), str):
        res['created_at'] = datetime.fromisoformat(res['created_at'])
    if isinstance(res.get('updated_at'), str):
        res['updated_at'] = datetime.fromisoformat(res['updated_at'])
    return LoanApplication(**res)

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
