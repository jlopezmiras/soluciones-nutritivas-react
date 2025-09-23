from pydantic import BaseModel
from typing import Optional


class IrrigationWaterBase(BaseModel):
    name: str
    nitrato: float = 0.0
    fosforo: float = 0.0
    sulfato: float = 0.0
    bicarbonato: float = 0.0
    carbonato: float = 0.0
    cloruro: float = 0.0
    sodio: float = 0.0
    calcio: float = 0.0
    magnesio: float = 0.0
    potasio: float = 0.0
    amonio: float = 0.0
    ph: float = 0.0
    conductivity: float = 0.0


class IrrigationWaterCreate(IrrigationWaterBase):
    pass


class IrrigationWater(IrrigationWaterBase):
    id: int
    class Config:
        orm_mode = True


class FertilizerBase(BaseModel):
    name: str
    state: str = "s"
    r_n_nitrico: float = 0.0
    r_fosforo_ox: float = 0.0
    r_fosforo: float = 0.0
    r_azufre_ox: float = 0.0
    r_azufre: float = 0.0
    r_cloro: float = 0.0
    r_n_amoniacal: float = 0.0
    r_potasio_ox: float = 0.0
    r_potasio: float = 0.0
    r_calcio_ox: float = 0.0
    r_calcio: float = 0.0
    r_magnesio_ox: float = 0.0
    r_magnesio: float = 0.0
    r_hidrogenion: float = 0.0
    r_n_ureico: float = 0.0
    ph: float = 0.0
    conductivity: float = 0.0


class FertilizerCreate(FertilizerBase):
    pass


class Fertilizer(FertilizerBase):
    id: int
    class Config:
        orm_mode = True
