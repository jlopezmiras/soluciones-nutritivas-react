import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import crud, models, schemas
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Fruit(BaseModel):
    name : str

class Fruits(BaseModel):
    fruits: List[Fruit]


origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





# --- Irrigation Waters ---
@app.post("/waters/", response_model=schemas.IrrigationWater)
def create_water(water: schemas.IrrigationWaterCreate, db: Session = Depends(get_db)):
    return crud.create_irrigation_water(db, water)

@app.get("/waters/", response_model=list[schemas.IrrigationWater])
def list_waters(db: Session = Depends(get_db)):
    return crud.get_irrigation_waters(db)

@app.get("/waters/{water_id}", response_model=schemas.IrrigationWater)
def get_water(water_id: int, db: Session = Depends(get_db)):
    water = crud.get_irrigation_water(db, water_id)
    if not water:
        raise HTTPException(status_code=404, detail="Water not found")
    return water

@app.put("/waters/{water_id}", response_model=schemas.IrrigationWater)
def update_water(water_id: int, water: schemas.IrrigationWaterCreate, db: Session = Depends(get_db)):
    updated = crud.update_irrigation_water(db, water_id, water)
    if not updated:
        raise HTTPException(status_code=404, detail="Water not found")
    return updated

@app.delete("/waters/{water_id}", response_model=schemas.IrrigationWater)
def delete_water(water_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_irrigation_water(db, water_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Water not found")
    return deleted


# --- Fertilizers ---
@app.post("/fertilizers/", response_model=schemas.Fertilizer)
def create_fertilizer(fert: schemas.FertilizerCreate, db: Session = Depends(get_db)):
    return crud.create_fertilizer(db, fert)

@app.get("/fertilizers/", response_model=list[schemas.Fertilizer])
def list_fertilizers(db: Session = Depends(get_db)):
    return crud.get_fertilizers(db)

@app.get("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def get_fertilizer(fert_id: int, db: Session = Depends(get_db)):
    fert = crud.get_fertilizer(db, fert_id)
    if not fert:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return fert

@app.put("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def update_fertilizer(fert_id: int, fert: schemas.FertilizerCreate, db: Session = Depends(get_db)):
    updated = crud.update_fertilizer(db, fert_id, fert)
    if not updated:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return updated

@app.delete("/fertilizers/{fert_id}", response_model=schemas.Fertilizer)
def delete_fertilizer(fert_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_fertilizer(db, fert_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    return deleted



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



