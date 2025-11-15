# app/schemas/manager.py

from pydantic import BaseModel
from typing import Any, Dict, Optional, List


PROPS = [
    "no3", "h2po4", "so4", "hco3", "cl", "na", "ca", "mg", "k", "nh4"
]


# --- Base nutrient schema ---

class NutrientBase(BaseModel):
    no3: float | List[float] = 0.0
    h2po4: float | List[float] = 0.0
    so4: float | List[float] = 0.0
    hco3: float | List[float] = 0.0
    cl: float | List[float] = 0.0
    na: float | List[float] = 0.0
    ca: float | List[float] = 0.0
    mg: float | List[float] = 0.0
    k: float | List[float] = 0.0
    nh4: float | List[float] = 0.0

class NutrientThreshold(BaseModel):
    no3: List[float] = []
    h2po4: List[float] = []
    so4: List[float] = []
    hco3: List[float] = []
    cl: List[float] = []
    na: List[float] = []
    ca: List[float] = []
    mg: List[float] = []
    k: List[float] = []
    nh4: List[float] = []


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
    name: str
    nutrients: List[str]
    state: str = None

    class Config:
        orm_mode = True

# schema for adding fertilizer card into manager
class FertilizerName(BaseModel):
    fert_name: str

# schema for fertilizer rows in table
class FertilizerRows(NutrientBase):
    name : str
    qty : float = 0.0


# --- SolucionNutritivaManager schemas ---

class SolutionManagerCreate(BaseModel):
    solution : dict
    water: dict

class SolutionManagerTableRow(NutrientBase):
    name : str
    qty : float | None = None

class TypeNutrient(BaseModel):
    target: List[str]
    locked: List[str]
    threshold: Dict[str, Any]

class ManagerResponse(BaseModel):
    data: List[SolutionManagerTableRow]
    typeNutrient: TypeNutrient


class SolucionNutritivaManagerRead(BaseModel):
    id: str
    solution_name: str
    water_name: str
    intakes: dict
    properties: dict
    candidate_fertilizers: List[FertilizerRead] = []
