
from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from api.tanks_schemas import FlowRequest, OtherTanksInfo, TankCreate, TankRead
from reparto.tanks_manager import TankManager


router = APIRouter()

manager = TankManager()


@router.get("/tanks")
def get_tanks():
    return manager.get_tanks()

@router.post("/tanks")
def add_tank(tank: TankCreate):
    print(tank.__dict__)
    return manager.add_tank(
        name=tank.name,
        volume=tank.volume,
        main_fertilizer=tank.main_fertilizer,
        main_fertilizer_qty=tank.main_fertilizer_qty,
        mixed_fertilizers=tank.mixed_fertilizers
    )

@router.get("/tanks/{tank_id}", response_model=TankRead)
def get_tank(tank_id: int):
    return manager.get_tank(tank_id)

@router.put("/tanks/{tank_id}")
def update_tank(tank_id: int, tank: TankRead):
    return manager.update_tank(tank_id, tank.name, tank.volume, tank.fertilizers)

@router.delete("/tanks/{tank_id}")
def delete_tank(tank_id: int):
    manager.delete_tank(tank_id)
    return {"message": "Tanque eliminado"}



@router.get("/available-fertilizers", response_model=List[str])
def get_available_fertilizers():
    return [fert.name for fert in manager.fertilizer_list]



@router.get("/other-tanks-info", response_model=OtherTanksInfo)
def get_other_tanks_info():
    return {
        "tankCount" : manager.tankCount(), 
        "existingFertilizers" : [tank.main_fertilizer for tank in manager.get_tanks()]
    }


@router.post("/total-flow")
def set_total_flow(flow: FlowRequest):
    manager.set_flow(flow.flow)
    return {"message": "Total flow updated"}