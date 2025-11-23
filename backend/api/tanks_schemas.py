
from typing import Dict, List
from pydantic import BaseModel

class Tank(BaseModel):
    id: int
    name: str
    volume: float
    fertilizers: Dict[str, float]

class TankCreate(BaseModel):
    name: str
    volume: float
    main_fertilizer: str
    main_fertilizer_qty: float
    mixed_fertilizers: List[str]

class TankRead(BaseModel):
    id: int
    name: str
    volume: float
    main_fertilizer: str
    fertilizers: Dict[str, float]
    flow: float
    injection: float


class OtherTanksInfo(BaseModel):
    tankCount: int
    existingFertilizers: List[str]