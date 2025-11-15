from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.dependencies import get_db
from api import library_schemas as schemas
import database.crud as crud
from database.crud import Irrigation_Water_DB
from api.solution_manager_schemas import IrrigationWaterOut
from typing import List

router = APIRouter()


# --- Step 1. NutritiveSolution choice ---
@router.get("/waters/", response_model=List[IrrigationWaterOut])
def list_solutions(db: Session = Depends(get_db)):
    return db.query(Irrigation_Water_DB).all()