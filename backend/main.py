from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, init_db, Trade
from pydantic import BaseModel
from typing import List

app = FastAPI(title="RegimeSense Backend API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TradeSchema(BaseModel):
    asset: str
    action: str
    price: float

@app.get("/")
def read_root():
    return {"message": "Welcome to RegimeSense Analytics API"}

@app.post("/trades/", response_model=TradeSchema)
def create_trade(trade: TradeSchema, db: Session = Depends(get_db)):
    db_trade = Trade(asset=trade.asset, action=trade.action, price=trade.price)
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

@app.get("/trades/")
def read_trades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trades = db.query(Trade).offset(skip).limit(limit).all()
    return trades
