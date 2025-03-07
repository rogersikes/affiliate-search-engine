from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from pydantic import BaseModel
from typing import List, Optional
import uuid
import models
from database import engine, get_db
from routers import auth, search, affiliate

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Affiliate Search API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(search.router)
app.include_router(affiliate.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Affiliate Search API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
