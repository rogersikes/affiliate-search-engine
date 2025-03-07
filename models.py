from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    clicks = relationship("Click", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    
class Click(Base):
    __tablename__ = "clicks"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    product_id = Column(String, index=True)
    affiliate_network = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="clicks")
    
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    product_id = Column(String, index=True)
    amount = Column(Float)
    commission = Column(Float)
    charity_amount = Column(Float)
    charity_id = Column(String, ForeignKey("charities.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    charity = relationship("Charity", back_populates="transactions")
    
class Charity(Base):
    __tablename__ = "charities"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    website = Column(String)
    
    # Relationships
    transactions = relationship("Transaction", back_populates="charity")
