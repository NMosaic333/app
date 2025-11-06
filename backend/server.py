from fastapi import FastAPI, APIRouter, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import os
import uuid
import shutil

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# FastAPI app
app = FastAPI()

# Routers
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Models
class LoanApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firstName: str
    lastName: str
    dob: str
    gender: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    pin: str
    employmentType: str
    employerName: Optional[str] = None
    monthlyIncome: Optional[float] = None
    loanAmount: float
    loanTenure: int
    existingLoans: Optional[str] = None
    panNumber: Optional[str] = None
    aadharNumber: Optional[str] = None
    certificatePath: Optional[str] = None
    status: str = Field(default="PENDING")  # PENDING | APPROVED | REJECTED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# -------------------- PUBLIC ENDPOINTS --------------------
@api_router.post("/loans", response_model=LoanApplication)
async def submit_loan(
    firstName: str = Form(...),
    lastName: str = Form(...),
    dob: str = Form(...),
    gender: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    pin: str = Form(...),
    employmentType: str = Form(...),
    employerName: Optional[str] = Form(None),
    monthlyIncome: Optional[float] = Form(None),
    loanAmount: float = Form(...),
    loanTenure: int = Form(...),
    existingLoans: Optional[str] = Form(None),
    panNumber: Optional[str] = Form(None),
    aadharNumber: Optional[str] = Form(None),
    incomeCertificate: UploadFile = File(...),
):
    # Save the uploaded file
    cert_path = UPLOAD_DIR / f"{uuid.uuid4()}_{incomeCertificate.filename}"
    with cert_path.open("wb") as buffer:
        shutil.copyfileobj(incomeCertificate.file, buffer)

    loan = LoanApplication(
        firstName=firstName,
        lastName=lastName,
        dob=dob,
        gender=gender,
        email=email,
        phone=phone,
        address=address,
        city=city,
        state=state,
        pin=pin,
        employmentType=employmentType,
        employerName=employerName,
        monthlyIncome=monthlyIncome,
        loanAmount=loanAmount,
        loanTenure=loanTenure,
        existingLoans=existingLoans,
        panNumber=panNumber,
        aadharNumber=aadharNumber,
        certificatePath=str(cert_path),
    )

    doc = loan.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()

    await db.loan_applications.insert_one(doc)
    return loan

# -------------------- ADMIN ENDPOINTS --------------------
@admin_router.get("/loans", response_model=List[LoanApplication])
async def get_loans(status: Optional[str] = Query(None), email: Optional[str] = Query(None)):
    query = {}
    if status:
        query["status"] = status.upper()
    if email:
        query["email"] = email

    loans = await db.loan_applications.find(query, {"_id": 0}).to_list(1000)
    for loan in loans:
        if isinstance(loan.get("created_at"), str):
            loan["created_at"] = datetime.fromisoformat(loan["created_at"])
        if isinstance(loan.get("updated_at"), str):
            loan["updated_at"] = datetime.fromisoformat(loan["updated_at"])
    return loans

@admin_router.get("/loans/{loan_id}", response_model=LoanApplication)
async def get_loan(loan_id: str):
    loan = await db.loan_applications.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if isinstance(loan.get("created_at"), str):
        loan["created_at"] = datetime.fromisoformat(loan["created_at"])
    if isinstance(loan.get("updated_at"), str):
        loan["updated_at"] = datetime.fromisoformat(loan["updated_at"])
    return LoanApplication(**loan)

@admin_router.patch("/loans/{loan_id}/status", response_model=LoanApplication)
async def update_loan_status(loan_id: str, status: str = Form(...)):
    status = status.upper()
    if status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be APPROVED or REJECTED.")

    update = {
        "status": status,
        "updated_at": datetime.utcnow().isoformat()
    }

    updated_loan = await db.loan_applications.find_one_and_update(
        {"id": loan_id},
        {"$set": update},
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER
    )
    if not updated_loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Convert datetime strings back
    if isinstance(updated_loan.get("created_at"), str):
        updated_loan["created_at"] = datetime.fromisoformat(updated_loan["created_at"])
    if isinstance(updated_loan.get("updated_at"), str):
        updated_loan["updated_at"] = datetime.fromisoformat(updated_loan["updated_at"])

    return LoanApplication(**updated_loan)

@admin_router.get("/loans/{loan_id}/certificate")
async def download_certificate(loan_id: str):
    loan = await db.loan_applications.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    cert_path = loan.get("certificatePath")
    if not cert_path or not Path(cert_path).exists():
        raise HTTPException(status_code=404, detail="Certificate not found")
    return FileResponse(cert_path, filename=Path(cert_path).name, media_type="application/octet-stream")

# -------------------- INCLUDE ROUTERS --------------------
app.include_router(api_router)
app.include_router(admin_router)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB SHUTDOWN --------------------
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
