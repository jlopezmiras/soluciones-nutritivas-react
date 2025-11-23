from dataclasses import asdict
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.dependencies import get_db
from api import library_schemas as schemas
from solution_manager.logic import SolutionManagerManual
import database.crud as crud
from database.crud import Irrigation_Water_DB, Fertilizer_DB
from api.solution_manager_manual_schemas import FertilizerName, FertilizerRead, FertilizerRows, ManagerResponse, SolutionManagerCreate, SolutionManagerTableRow
from typing import Dict, List
from reparto.tanks_manager import TankManager

router = APIRouter()


NUTRIENTS = [
    'no3',
    'h2po4',
    'so4',
    'hco3',
    'cl',
    'na',
    'ca',
    'mg',
    'k',
    'nh4',
]


# --- MANAGER ---
# Whenever the irrigation water, the target solution or the fertilizers database change,
# the manager updates accordongly. It returns the rows of target solution, irrigation water and fertilizers
@router.post("/create-manager", response_model=ManagerResponse)
def cache_fertilizers(payload: SolutionManagerCreate | None = None, db: Session = Depends(get_db)):

    manager = SolutionManagerManual()

    # If no payload there is no modification to target solution or water, just fetch fertilizers
    if payload is None:
        manager.fetch_fertilizers(db.query(Fertilizer_DB).all())
        return {
            "data": toTableRows(manager),
            "typeNutrient": {
                "target": manager.target_nutrients,
                "locked": manager.locked_nutrients,
                "threshold": manager.target.threshold_nutrients
            }
    }
    
    # We set the target solution and water in the manager
    print("Payload received in backend:", payload)

    # Find the water in the DB by name
    water_db = db.query(Irrigation_Water_DB).filter(Irrigation_Water_DB.name == payload.water['name']).first()
    if not water_db:
        raise HTTPException(status_code=404, detail="Irrigation water not found")
    
    manager.set_irrigation_water(water_db)

    targets = payload.solution["targets"]
    thresholds_max = {nut: vals for nut, vals in payload.solution["thresholds"]['max'].items() if nut not in targets}
    thresholds_min = {nut: vals for nut, vals in payload.solution["thresholds"]['min'].items() if nut not in targets}
    thresholds = {
        "max" : thresholds_max,
        "min" : thresholds_min,
    }
    manager.set_target_solution({
        "target_nutrients" : targets, 
        "locked_nutrients" : payload.solution["locked"], 
        "threshold_nutrients" : thresholds
        })
    manager.fetch_fertilizers(db.query(Fertilizer_DB).all())

    return {
        "data": toTableRows(manager),
        "typeNutrient": {
            "target": manager.target_nutrients,
            "locked": manager.locked_nutrients,
            "threshold": manager.target.threshold_nutrients
        }
    }


@router.post("/reset-manager")
def reset_manager_fertilizers():
    SolutionManagerManual().reset_fertilizers()
    return


def toTableRows(manager: SolutionManagerManual) -> List[SolutionManagerTableRow]:

    if not manager.water or not manager.target:
        raise HTTPException(status_code=400, detail="Manager is not properly configured")
    
    print(f"Solucion con thresholds {manager.target.properties_with_thresholds()}")
    
    return [
        # Target solution row
        SolutionManagerTableRow(
            name="Solución objetivo",
            qty=None,
            **{nut: val for nut, val in manager.target.properties_with_thresholds().items() if nut in NUTRIENTS}
        ),
        # Irrigation water row
        SolutionManagerTableRow(
            name=manager.water.name,
            qty=None,
            **{nut: val for nut, val in manager.water.properties().items() if nut in NUTRIENTS}
        ),
        # Intake row
        SolutionManagerTableRow(
            name="Aportes necesarios",
            qty=None,
            **{nut: val for nut, val in manager.get_intakes_with_thresholds().items() if nut in NUTRIENTS}
        ),
        # Fertilizers rows
        *[
        FertilizerRows(
            name=fert.name,
            qty=fert.qty,
            **{nut: val for nut, val in fert.properties().items() if nut in NUTRIENTS}
        )
        for fert in manager.active_fertilizers_qty
        ],
        # Nutrient differences
        SolutionManagerTableRow(
            name="Diferencia nutrientes",
            qty=None,
            **{nut: val for nut, val in manager.nutrient_differences_with_thresholds().items() if nut in NUTRIENTS}
        ),
        # Real intakes
        SolutionManagerTableRow(
            name="Aportes reales",
            qty=None,
            **{nut: val for nut, val in manager.get_fertilizer_intakes().items() if nut in NUTRIENTS}
        )
    ]


# --- Add fertilizer to manager ---
@router.post("/add-fertilizer")
def add_fertilizer(fert: FertilizerName):
    SolutionManagerManual().add_fertilizer(fert.fert_name)
    return



# --- Handle finish of manager ---
@router.post("/finalize-manager")
def finilize_manager():
    fertilizer_list = [
        {
            "name": fert.name,
            "quantity": fert.qty,
            "density": fert.fertilizer.density,
            "mmol": True,
        }
        for fert in SolutionManagerManual().active_fertilizers_qty]
    print(fertilizer_list)
    TankManager().set_fertilizer_list(fertilizer_list)
    return



# --- TOP TABLE ---
# rows of fertilizers in the table
@router.get("/fertilizer-rows", response_model=List[FertilizerRows])
def get_fertilizer_rows():
    ferts = SolutionManagerManual().active_fertilizers

    return [
        FertilizerRows(
            name=fert.name,
            **{nut: val for nut, val in asdict(fert).items() if nut in NUTRIENTS}
        )
        for fert in ferts
    ]


# --- FERTILIZERS ---
# fertilizers in the cards to add to the table
@router.get("/fertilizers/", response_model=List[FertilizerRead])
def get_fertilizers(db: Session = Depends(get_db)):
    ferts = db.query(Fertilizer_DB).all()

    return [
        FertilizerRead(
            name=fert.name,
            nutrients=[nutrient for nutrient in NUTRIENTS if round(getattr(fert,nutrient),1)!=0.0],
            state=fert.state
        )
        for fert in ferts
    ]


