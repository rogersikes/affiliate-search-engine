from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])

class ProductResponse(BaseModel):
    id: str
    title: str
    description: str
    price: float
    image_url: str
    source: str
    affiliate_url: Optional[str] = None

    class Config:
        orm_mode = True

# Mock product database - In production, you would connect to real affiliate networks
MOCK_PRODUCTS = [
    {
        "id": "p1",
        "title": "Professional Broom",
        "description": "High-quality broom for all your sweeping needs",
        "price": 19.99,
        "image_url": "https://example.com/broom.jpg",
        "source": "amazon",
        "base_affiliate_url": "https://amazon.com/product/p1?tag=affiliate&subid="
    },
    {
        "id": "p2",
        "title": "Luxury Broom Plus",
        "description": "Premium broom with ergonomic handle and extra-wide sweep",
        "price": 29.99,
        "image_url": "https://example.com/luxury-broom.jpg",
        "source": "walmart",
        "base_affiliate_url": "https://walmart.com/item/p2?affiliateid=main&sid="
    }
]

@router.get("/products", response_model=List[ProductResponse])
def search_products(
    query: str,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In a real app, this would search external APIs or databases
    # For now, we'll just filter our mock data
    results = []
    
    for product in MOCK_PRODUCTS:
        if query.lower() in product["title"].lower() or query.lower() in product["description"].lower():
            # Add user's ID to affiliate URL if the user is logged in
            affiliate_url = f"{product['base_affiliate_url']}{user.id}" if user else None
            
            results.append({
                "id": product["id"],
                "title": product["title"],
                "description": product["description"],
                "price": product["price"],
                "image_url": product["image_url"],
                "source": product["source"],
                "affiliate_url": affiliate_url
            })
            
    return results

@router.get("/public/products", response_model=List[ProductResponse])
def search_products_public(query: str, db: Session = Depends(get_db)):
    # Public endpoint for initial search (without affiliate links)
    results = []
    
    for product in MOCK_PRODUCTS:
        if query.lower() in product["title"].lower() or query.lower() in product["description"].lower():
            results.append({
                "id": product["id"],
                "title": product["title"],
                "description": product["description"],
                "price": product["price"],
                "image_url": product["image_url"],
                "source": product["source"],
                "affiliate_url": None  # No affiliate URL for non-logged in users
            })
            
    return results
