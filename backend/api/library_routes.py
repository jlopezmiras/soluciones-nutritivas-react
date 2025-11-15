from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.dependencies import get_db
from api import library_schemas as schemas
import database.crud as crud

router = APIRouter()


# --- Irrigation Waters ---
@router.post("/waters/", response_model=schemas.IrrigationWater)
def create_water(water: schemas.IrrigationWaterCreate, db: Session = Depends(get_db)):
    return crud.create_irrigation_water(db, water)

@router.get("/waters/", response_model=list[schemas.IrrigationWater])
def list_waters(db: Session = Depends(get_db)):
    return crud.get_irrigation_waters(db)

@router.get("/waters/{water_id}", response_model=schemas.IrrigationWater)
def get_water(water_id: int, db: Session = Depends(get_db)):
    water = crud.get_irrigation_water(db, water_id)
    if not water:
        raise HTTPException(status_code=404, detail="Water not found")
    return water

@router.put("/waters/{water_id}", response_model=schemas.IrrigationWater)
def update_water(water_id: int, water: schemas.IrrigationWaterCreate, db: Session = Depends(get_db)):
    updated = crud.update_irrigation_water(db, water_id, water)
    if not updated:
        raise HTTPException(status_code=404, detail="Water not found")
    return updated

@router.delete("/waters/{water_id}", response_model=schemas.IrrigationWater)
def delete_water(water_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_irrigation_water(db, water_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Water not found")
    return deleted


# --- Fertilizers ---
@router.post("/fertilizers/", response_model=schemas.Fertilizer)
def create_fertilizer(fert: schemas.FertilizerCreate, db: Session = Depends(get_db)):
    return crud.create_fertilizer(db, fert)

@router.get("/fertilizers/", response_model=list[schemas.Fertilizer])
def list_fertilizers(db: Session = Depends(get_db)):
    return crud.get_fertilizers(db)

@router.get("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def get_fertilizer(fert_id: int, db: Session = Depends(get_db)):
    fert = crud.get_fertilizer(db, fert_id)
    if not fert:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return fert

@router.put("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def update_fertilizer(fert_id: int, fert: schemas.FertilizerCreate, db: Session = Depends(get_db)):
    updated = crud.update_fertilizer(db, fert_id, fert)
    if not updated:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return updated

@router.delete("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def delete_fertilizer(fert_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_fertilizer(db, fert_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return deleted



