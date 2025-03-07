from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import uuid
import models
from database import get_db
from routers.auth import get_current_user
import datetime

router = APIRouter(prefix="/affiliate", tags=["affiliate"])

class ClickCreate(BaseModel):
    product_id: str
    affiliate_network: str

class ClickResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    affiliate_network: str
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

class CharityResponse(BaseModel):
    id: str
    name: str
    description: str
    website: str

    class Config:
        orm_mode = True

# Routes
@router.post("/click", response_model=ClickResponse)
def record_click(
    click: ClickCreate, 
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_click = models.Click(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        product_id=click.product_id,
        affiliate_network=click.affiliate_network
    )
    
    db.add(db_click)
    db.commit()
    db.refresh(db_click)
    return db_click

@router.get("/charities", response_model=List[CharityResponse])
def list_charities(db: Session = Depends(get_db)):
    return db.query(models.Charity).all()

@router.get("/stats", response_model=dict)
def get_affiliate_stats(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Count clicks
    click_count = db.query(models.Click).filter(
        models.Click.user_id == current_user.id
    ).count()
    
    # Sum transactions
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).all()
    
    total_earnings = sum(t.commission for t in transactions)
    total_charity = sum(t.charity_amount for t in transactions)
    
    return {
        "click_count": click_count,
        "transaction_count": len(transactions),
        "total_earnings": total_earnings,
        "total_charity_donation": total_charity
    }
