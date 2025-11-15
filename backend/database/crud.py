from chemical_properties.chemical_properties import ValueChemicalProperty, chemicals
from sqlalchemy.orm import Session
from database.models import Irrigation_Water_DB, Fertilizer_DB
from api.library_schemas import IrrigationWaterCreate, FertilizerCreate


# --- Irrigation water ---
def create_irrigation_water(db: Session, water: IrrigationWaterCreate):

    attr_water = water.model_dump()
    
    # Lista de propiedades químicas
    props = ['no3', 'h2po4', 'so4', 'hco3', 'co3', 'cl', 'na', 'k', 'ca', 'mg', 'nh4']
    # Crear lista de listas
    chemicalitems = [[prop, attr_water[prop], attr_water['units'][prop]] for prop in props]

    for ch_field, value, unit in chemicalitems:
        attr_water[ch_field] = ValueChemicalProperty(
            chemical=chemicals[ch_field], 
            value=value, 
            unit=unit).convert_to_unit("mmol/l")
        
    attr_water.pop('units', None)

    # Get value of co3 and convert to hco3
    if attr_water['co3'] > 0:
        attr_water['hco3'] = attr_water['hco3'] + 2 * attr_water['co3']
    attr_water.pop('co3', None)


    db_water = Irrigation_Water_DB(**attr_water, raw_input=water.model_dump())
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
    # Transform the units to mmol/l
    attr_fert = fert.model_dump()

    # Get value of hydrogenion and convert to hco3
    attr_fert['hco3'] = 0
    attr_fert['units']['hco3'] = 'mmol/l'
    if attr_fert['hydrogenion'] > 0:
        attr_fert['hco3'] = -attr_fert['hydrogenion']
        attr_fert['units']['hco3'] = attr_fert['units']['hydrogenion']
        
    attr_fert.pop('hydrogenion', None)
    
    # Lista de propiedades químicas
    props = ['no3', 'h2po4', 'so4', 'hco3', 'cl', 'na', 'k', 'ca', 'mg', 'nh4']
    # Crear lista de listas
    chemicalitems = [[prop, attr_fert[prop], attr_fert['units'][prop]] for prop in props]

    for ch_field, value, unit in chemicalitems:
        attr_fert[ch_field] = ValueChemicalProperty(
            chemical=chemicals[ch_field], 
            value=value, 
            unit=unit).convert_to_unit("mmol/l")
        
    attr_fert.pop('units', None)

    db_fert = Fertilizer_DB(**attr_fert, raw_input=fert.model_dump())
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
