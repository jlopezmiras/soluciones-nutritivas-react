import json
from dataclasses import dataclass
import os

base_path = os.path.dirname(__file__)

@dataclass
class ChemicalProperty:
    name : str
    formula : str
    valence : int
    molar_mass : float

    @property
    def nature(self):
        if self.valence == 0:
            return 'neutral'
        elif self.valence > 0:
            return 'cation'
        else:
            return 'anion'


@dataclass
class ValueChemicalProperty():
    chemical : ChemicalProperty
    value : float
    unit : str = 'mmol/l'

    def convert_to_unit(self, to_unit):

        if self.unit == to_unit:
            return self.value
        
        match self.unit.lower():
            case 'mmol/l':
                mmoll = self.value
            case 'meq/l':
                mmoll = self.value / self.chemical.valence
            case 'mg/l':
                mmoll = self.value / self.chemical.molar_mass

        match to_unit.lower():
            case 'mmol/l':
                return mmoll
            case 'meq/l':
                return abs( mmoll * self.chemical.valence)
            case 'mg/l':
                return mmoll * self.chemical.molar_mass

    def __str__(self):
        return f"{self.ch_property.formula}: {self.value} {self.unit}"
    



def meq_sum(chemicals_values):
    
    cation_sum = 0
    anion_sum = 0
    for key, value in chemicals_values.items():
        chemical = chemicals[key]
        if chemical.nature == 'cation':
            cation_sum += ValueChemicalProperty(chemical, *value).convert_to_unit('meq/l')
        elif chemical.nature == 'anion':
            anion_sum += ValueChemicalProperty(chemical, *value).convert_to_unit('meq/l')

    return cation_sum, anion_sum




chemicals = {}

with open(os.path.join(base_path,"chemical_properties.json"), 'r', encoding='utf-8') as file:
    data = json.load(file)
    for item in data:
        chemicals[item["formula"].lower()] = ChemicalProperty(*item.values())


if __name__ == "__main__":
    print(chemicals['so4'].nature)