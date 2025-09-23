from chemical_properties.chemical_properties import ValueChemicalProperty, chemicals
from sqlalchemy.orm import Session
from models import Irrigation_Water_DB, Fertilizer_DB
from schemas import IrrigationWaterCreate, FertilizerCreate


# --- Irrigation water ---
def create_irrigation_water(db: Session, water: IrrigationWaterCreate):
    # Transform the units to mmol/l
    attr_water = water.dict()
    
    # Lista de propiedades químicas
    props = ['nitrato', 'carbonato', 'fosforo', 'cloruro', 'potasio', 'sodio', 'amonio', 'bicarbonato', 'calcio', 'magnesio', 'sulfato']
    # Crear lista de listas
    chemicalitems = [[prop, attr_water[prop], attr_water['units'][prop]] for prop in props]

    for ch_field, value, unit in chemicalitems:
        attr_water[ch_field] = ValueChemicalProperty(
            chemical=chemicals[ch_field], 
            value=value, 
            unit=unit).convert_to_unit("mmol/l")
        
    attr_water.pop('units', None)

    db_water = Irrigation_Water_DB(**attr_water)
    db.add(db_water)
    db.commit()
    db.refresh(db_water)
    return db_water

def get_irrigation_waters(db: Session):
    return db.query(Irrigation_Water_DB).all()

def get_irrigation_water(db: Session, water_id: int):
    return db.query(Irrigation_Water_DB).filter(Irrigation_Water_DB.id == water_id).first()

def update_irrigation_water(db: Session, water_id: int, water: IrrigationWaterCreate):
    db_water = get_irrigation_water(db, water_id)
    if not db_water:
        return None
    for key, value in water.dict().items():
        setattr(db_water, key, value)
    db.commit()
    db.refresh(db_water)
    return db_water

def delete_irrigation_water(db: Session, water_id: int):
    db_water = get_irrigation_water(db, water_id)
    if not db_water:
        return None
    db.delete(db_water)
    db.commit()
    return db_water


# --- Fertilizer ---
def create_fertilizer(db: Session, fert: FertilizerCreate):
    db_fert = Fertilizer_DB(**fert.dict())
    db.add(db_fert)
    db.commit()
    db.refresh(db_fert)
    return db_fert

def get_fertilizers(db: Session):
    return db.query(Fertilizer_DB).all()

def get_fertilizer(db: Session, fert_id: int):
    return db.query(Fertilizer_DB).filter(Fertilizer_DB.id == fert_id).first()

def update_fertilizer(db: Session, fert_id: int, fert: FertilizerCreate):
    db_fert = get_fertilizer(db, fert_id)
    if not db_fert:
        return None
    for key, value in fert.dict().items():
        setattr(db_fert, key, value)
    db.commit()
    db.refresh(db_fert)
    return db_fert

def delete_fertilizer(db: Session, fert_id: int):
    db_fert = get_fertilizer(db, fert_id)
    if not db_fert:
        return None
    db.delete(db_fert)
    db.commit()
    return db_fert
