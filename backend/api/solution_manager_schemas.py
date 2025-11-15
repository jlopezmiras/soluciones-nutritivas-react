# app/schemas/manager.py

from pydantic import BaseModel
from typing import Optional, List


PROPS = [
    "no3", "h2po4", "so4", "hco3", "cl", "na", "ca", "mg", "k", "nh4"
]


# --- Base nutrient schema ---

class NutrientBase(BaseModel):
    no3: float = 0.0
    h2po4: float = 0.0
    so4: float = 0.0
    hco3: float = 0.0
    cl: float = 0.0
    na: float = 0.0
    ca: float = 0.0
    mg: float = 0.0
    k: float = 0.0
    nh4: float = 0.0


# --- Irrigation water and solution ---

class IrrigationWaterCreate(NutrientBase):
    name: str
    ph: float = 0.0
    conductivity: float = 0.0


class IrrigationWaterOut(NutrientBase):
    name: str
    ph: float = 0.0
    conductivity: float = 0.0
    date: Optional[str] = None
    description: Optional[str] = None


class SolucionNutritivaCreate(NutrientBase):
    name: str
    ph: float = 0.0
    conductivity: float = 0.0


# --- Fertilizer read model (from DB) ---

class FertilizerRead(NutrientBase):
    id: int
    name: str
    state: Optional[str] = None
    density: Optional[float] = None


# --- SolucionNutritivaManager schemas ---

class SolucionNutritivaManagerCreate(BaseModel):
    ideal_solution: SolucionNutritivaCreate
    water: IrrigationWaterCreate
    candidate_fertilizer_ids: Optional[List[int]] = []


class SolucionNutritivaManagerRead(BaseModel):
    id: str
    solution_name: str
    water_name: str
    intakes: dict
    properties: dict
    candidate_fertilizers: List[FertilizerRead] = []
