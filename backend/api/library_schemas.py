from pydantic import BaseModel
from typing import Optional, Dict, Literal, List


### This is how the data will be received and sent by the API ###

### --- Schemas for irrigation waters and fertilizers --- ###

class IrrigationWaterBase(BaseModel):
    name: str
    date: Optional[str] = None
    description: Optional[str] = None
    no3: float = 0.0
    h2po4: float = 0.0
    so4: float = 0.0
    hco3: float = 0.0
    co3: float = 0.0
    cl: float = 0.0
    na: float = 0.0
    ca: float = 0.0
    mg: float = 0.0
    k: float = 0.0
    nh4: float = 0.0
    ph: float = 0.0
    conductivity: float = 0.0
    units: Optional[Dict[str, Literal["mmol/L", "mg/L", "meq/L"]]] = None


class IrrigationWaterCreate(IrrigationWaterBase):
    pass


class IrrigationWater(IrrigationWaterBase):
    id: int
    class Config:
        orm_mode = True


class FertilizerBase(BaseModel):
    name: str
    date: Optional[str] = None
    description: Optional[str] = None
    state: Literal['s', 'l'] = 's' 
    density: float = 0.0 
    no3: float = 0.0
    h2po4: float = 0.0
    so4: float = 0.0
    hydrogenion: float = 0.0 # this would become -hco3 in the table
    cl: float = 0.0
    na: float = 0.0
    ca: float = 0.0
    mg: float = 0.0
    k: float = 0.0
    nh4: float = 0.0
    units: Optional[Dict[str, Literal["mmol/L", "mg/L", "meq/L"]]] = None


class FertilizerCreate(FertilizerBase):
    pass


class Fertilizer(FertilizerBase):
    id: int
    class Config:
        orm_mode = True


