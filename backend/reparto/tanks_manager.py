
from typing import Dict, List


# This should be the same class as FertilizerQuantity in solution manager
class FertilizerQty:
    def __init__(self, name: str, quantity: float, density: float):
        self.name = name
        self.quantity = quantity
        self.density = density



class Tank:
    def __init__(self, id: int, name: str, volume: float, main_fertilizer: str, fertilizers: Dict[str, float], flow:float=0.0):
        self.id = id
        self.name = name
        self.volume = volume
        self.main_fertilizer = main_fertilizer
        self.fertilizers = fertilizers
        self.flow = flow

        self.injection = 0.0 # Initially zero, will be computed later



class TankManager:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TankManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    

    
    def __init__(self):
        if not self._initialized:  # Evita reinicialización
            self.tanks = []
            self.next_id = 1

            # This would have to change to fetch from the solution_manager
            self.fertilizer_list = [
                FertilizerQty("Ácido fosfórico", 1.8, 0.000082),
                FertilizerQty("Ácido nítrico", 0.54, 0.000078),
                FertilizerQty("Nitrato cálcico", 2.98, 0.000216),
                FertilizerQty("Nitrato potásico", 4.40, 0.000101),
                FertilizerQty("Sulfato potásico", 1.095, 0.000174),
                FertilizerQty("Sulfato magnésico", 1.09, 0.000246),
            ]

            # This has also to be determined
            self.total_flow = 6000


            self.venturis = {
                fert.name: self.venturi(fert) for fert in self.fertilizer_list
            }

            self.injections = {}

            self._initialized = True


    def venturi(self, fert: FertilizerQty):
        return fert.density * fert.quantity * self.total_flow
    

    def compute_injection(self, tank: Tank):
        flows = sum(t.flow for t in self.tanks)
        if tank.flow > 0:
            injection = tank.flow * 100 / flows
            return injection
        return 0.0
            

    def update_injections(self):
        for tank in self.tanks:
            self.injections[tank.id] = self.compute_injection(tank)
            tank.injection = self.injections[tank.id]

    def add_tank(self, name: str, volume: float, main_fertilizer: str, main_fertilizer_qty: float, mixed_fertilizers: List[str]):
        
        # Total flow (liters/hour)
        flow = self.venturis[main_fertilizer] * volume / main_fertilizer_qty if main_fertilizer_qty > 0 else 0
        
        tank = {
            "id": self.next_id,
            "name": name,
            "volume": volume,
            "main_fertilizer": main_fertilizer,
            "fertilizers": {
                main_fertilizer: main_fertilizer_qty
            },
            "flow": flow
        }

        # Now we have to see if there are mixed fertilizers to add
        for fert in mixed_fertilizers:
            if flow > 0:
                qty = self.venturis[fert] * volume / flow
                tank["fertilizers"][fert] = qty

        self.tanks.append(Tank(**tank))
        self.update_injections()
        self.next_id += 1
        print(tank)
        return tank

    def get_tanks(self):
        return self.tanks

    def get_tank(self, tank_id: int):
        return next((t for t in self.tanks if t.id == tank_id), None)

    def update_tank(self, tank_id: int, name: str = None, volume: float = None, main_fertilizer: str = None,
                    fertilizers: Dict[str, float] = None):
        tank = self.get_tank(tank_id)
        if tank:
            if name: tank.name = name
            if volume: tank.volume = volume
            if fertilizers: tank.fertilizers = fertilizers
        return tank

    def delete_tank(self, tank_id: int):
        self.tanks = [t for t in self.tanks if t.id != tank_id]

    def tankCount(self):
        return len(self.tanks)
