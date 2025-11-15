from dataclasses import dataclass
from typing import Dict, List, Optional
import numpy as np
from scipy.optimize import linprog

from click import Tuple

from database.models import Irrigation_Water_DB

PROPS = [
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

@dataclass
class IrrigationWater:

    id          : int
    name        : str

    no3     : float = 0.0
    h2po4   : float = 0.0
    so4     : float = 0.0
    hco3    : float = 0.0
    cl      : float = 0.0
    nh4     : float = 0.0
    ca      : float = 0.0
    mg      : float = 0.0
    k       : float = 0.0
    na       : float = 0.0

    ph              : float = 0.0
    conductivity    : float = 0.0


    def __str__(self):
        return f"{self.name}"


    def properties(self):
        props = {}
        for key, value in self.__dict__.items():
            if key in PROPS:
                props[key] = value
        return props
    
    @classmethod
    def from_db(cls, db_obj):
        FIELDS = [
            "id", "name", "no3", "h2po4", "so4", "hco3",
            "cl", "nh4", "ca", "mg", "k", "na",
            "ph", "conductivity"
        ]
        data = {field: getattr(db_obj, field) for field in FIELDS}
        return cls(**data)
    



@dataclass
class Fertilizer:

    id   : int
    name  : str

    no3     : float = 0.0
    h2po4   : float = 0.0
    so4     : float = 0.0
    hco3    : float = 0.0
    cl      : float = 0.0
    nh4     : float = 0.0
    ca      : float = 0.0
    mg      : float = 0.0
    k       : float = 0.0
    na     : float = 0.0

    state : str = 's'
    density : float = 0.0

    def properties(self):
        props = {}
        for key, value in self.__dict__.items():
            if key in PROPS:
                props[key] = value
        return props
    
    @classmethod
    def from_db(cls, db_obj):
        FIELDS = [
            "id", "name", "no3", "h2po4", "so4", "hco3",
            "cl", "nh4", "ca", "mg", "k", "na",
            "state", "density"
        ]
        data = {field: getattr(db_obj, field) for field in FIELDS}
        return cls(**data)



class TargetSolution:
    def __init__(self, target_nutrients, locked_nutrients, threshold_nutrients):

        self.target_nutrients = {nut : float(value) for nut, value in target_nutrients.items()}
        self.locked_nutrients = locked_nutrients
        threshold_nutrients_min = {nut : (float(value) if value!="" else 0) for nut, value in threshold_nutrients['min'].items()}
        threshold_nutrients_max = {nut : (float(value) if value!="" else 1e4) for nut, value in threshold_nutrients['max'].items()}

        self.threshold_nutrients = {
            nut : [threshold_nutrients_min.get(nut, 0.0), threshold_nutrients_max.get(nut, 100.0)]
            for nut in list(set(list(threshold_nutrients_max.keys()) + list(threshold_nutrients_min.keys())))
        }

        print(self.threshold_nutrients)

        self.target_nutrients_labels = list(self.target_nutrients.keys())
        self.threshold_nutrients_labels = list(self.threshold_nutrients.keys())

        # For those nutrient not appearing in target, locked or thresholds,
        # assume a big threshold (maybe I could change this to put "realistic" thresholds)
        for nut in PROPS:
            if nut not in self.target_nutrients_labels + self.locked_nutrients + self.threshold_nutrients_labels:
                print(f"Nutrient {nut} not specified. Assuming a big threshold")
                self.threshold_nutrients[nut] = [0.0, 100.0]

        self.threshold_nutrients_labels = list(self.threshold_nutrients.keys())
        

    def properties_target(self):
        props = {}
        for key, value in self.target_nutrients.items():
            if key in PROPS:
                props[key] = value
        return props
    
    # Return the maximum of the threshold
    def properties_threshold(self):
        props = {}
        for key, value in self.threshold_nutrients.items():
            if key in PROPS:
                props[key] = value
        return props
    
    def properties(self):
        return self.properties_target() | {nut : max(val) for nut, val in self.properties_threshold().items()}
    
    def properties_with_thresholds(self):
        return self.properties_target() | self.properties_threshold()



class FertilizerQuantity:

    def __init__(self, fertilizer: Fertilizer, qty: float = 1.0):
        self.fertilizer = fertilizer
        self.qty = qty
        self.name = fertilizer.name

    def __str__(self):
        return f"{self.fertilizer.name}: {self.qty} mmol/L"
    
    def properties(self):
        return {prop: self.qty * self.fertilizer.properties()[prop] for prop in PROPS}
    
    def fert_vector(self):
        return np.array([self.properties()[prop] for prop in PROPS])
    
    def adjust_property(self, property: str, value: float):
        if property in PROPS and self.fertilizer.properties()[property] != 0:
            self.qty = value / self.fertilizer.properties()[property]
        return self.qty




class SolutionManagerManual:
    """Singleton-like manager that holds fertilizers in memory."""
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, ideal_solution: TargetSolution | None = None, water: IrrigationWater | None = None):

        if self._initialized:
            return
        
        self.properties = {prop: 0.0 for prop in (PROPS + ['ph', 'conductivity'])}

        self.target = ideal_solution
        self.water = water

        # This stores the fertilizers currently applied to the solution, with their quantities
        self.active_fertilizers_qty: List[FertilizerQuantity] = []
        # This stores the fertilizers currently applied to the solution, without their quantities
        self.active_fertilizers: List[Fertilizer] = []

        # This variable stores all fertilizers in memory so that we can forget about DB
        self.fertilizer_list: List[Fertilizer] = []

        self.intakes = self.get_intakes()


        self._initialized = True


    def set_irrigation_water(self, water: IrrigationWater | Irrigation_Water_DB | dict):
        try:
            if isinstance(water, Irrigation_Water_DB):
                self.water = IrrigationWater.from_db(water)
            elif isinstance(water, dict):
                self.water = IrrigationWater(**water)
            else:
                self.water = water
        except NameError as err:
            print(err)
            return
        self.intakes = self.get_intakes()
        print(f"Propiedades del agua {self.water.properties()}")
        return
    
    def set_target_solution(self, target_sol: TargetSolution | dict):
        try:
            if isinstance(target_sol, dict):
                print(target_sol)
                self.target = TargetSolution(**target_sol)
            else:
                self.target = target_sol
        except NameError as err:
            print(err)
            return
        
        # Set target nutrients as those coming from the ideal target solution
        self.target_nutrients = self.target.target_nutrients_labels
        self.locked_nutrients = self.target.locked_nutrients
        self.threshold_nutrients = self.target.threshold_nutrients_labels

        self.intakes = self.get_intakes()
        print(f"Propiedades de la solución ideal {self.target.properties()}")
        return


    # This account only for the intakes necessary to reach the target from the water
    # We set the maximum allowed for thresholds nutrients as a target
    def get_intakes(self) -> dict:
        if self.target == None or self.water == None:
            return {}
        
        intakes_from_target = {
            nut: self.target.properties()[nut]-self.water.properties()[nut] for nut in self.target_nutrients}
        
        intakes_from_threshold = {
            nut: self.target.properties()[nut]-self.water.properties()[nut] for nut in self.threshold_nutrients}
        
        intakes_from_locked = {nut: 0.0 for nut in self.locked_nutrients}
        
        return intakes_from_target | intakes_from_threshold | intakes_from_locked
    
    def get_intakes_with_thresholds(self) -> dict:
        if self.target == None or self.water == None:
            return {}
        
        intakes_from_target = {
            nut: self.target.properties()[nut]-self.water.properties()[nut] for nut in self.target_nutrients}
        
        intakes_from_threshold = {
            nut: [self.target.properties_threshold()[nut][0] - self.water.properties()[nut],
                  self.target.properties_threshold()[nut][1] - self.water.properties()[nut]]
                    for nut in self.threshold_nutrients}
        
        intakes_from_locked = {nut: 0.0 for nut in self.locked_nutrients}
        
        return intakes_from_target | intakes_from_threshold | intakes_from_locked
    

    # This accounts for the intakes from water + active fertilizers
    def nutrient_differences(self) -> dict:
        if self.target == None or self.water == None:
            return {}
        return {nut: self.intakes[nut] - 
                sum(fert.properties()[nut] for fert in self.active_fertilizers_qty) for nut in PROPS}
    
    def nutrient_differences_with_thresholds(self) -> dict:
        if self.target == None or self.water == None:
            return {}
        
        nut_diffs = {nut: self.intakes[nut] - 
                sum(fert.properties()[nut] for fert in self.active_fertilizers_qty) for nut in self.target_nutrients}
        
        for nut in self.threshold_nutrients:
            sum_fert = sum(fert.properties()[nut] for fert in self.active_fertilizers_qty)
            diff_min = min(self.get_intakes_with_thresholds()[nut]) - sum_fert
            diff_max = max(self.get_intakes_with_thresholds()[nut]) - sum_fert
            if diff_min < 0 and diff_max > 0:
                nut_diffs[nut] = 0.0
            elif diff_max < 0:
                nut_diffs[nut] = diff_max
            else:
                nut_diffs[nut] = diff_min
        
        return nut_diffs
    
    def fetch_fertilizers(self, ferts):
        self.fertilizer_list = [Fertilizer.from_db(fert) for fert in ferts]

    
    # Add a fertilizer
    def add_fertilizer(self, fert_name: str):
        fert = next((f for f in self.fertilizer_list if f.name.lower() == fert_name.lower()), None)

        if fert is None:
            return "nonfert"
        
        # Is there at least one nutrient in fert corresponding to a target nutrient?
        # If not, what is the sense of adding it? 
        nonzero_nuts = [nut for nut, val in fert.properties().items() if val != 0.0]
        if set(nonzero_nuts).isdisjoint(self.target_nutrients):
            return "notargetnut"
        

        self.active_fertilizers.append(fert)

        max_qty = min(
                abs( self.nutrient_differences()[prop] / fert.properties()[prop]) for prop in nonzero_nuts
            )
        print(max_qty)
        self.active_fertilizers_qty.append(FertilizerQuantity(fert, qty=max_qty))


    # Remove fertilizers
    def reset_fertilizers(self):
        self.active_fertilizers = []
        self.active_fertilizers_qty = []


    def get_fertilizer_intakes(self):
        props = {}
        for key in PROPS:
            props[key] = sum(fert.properties()[key] for fert in self.active_fertilizers_qty)
        print(props)
        return props







class SolucionNutritivaManager:

    def __init__(self, ideal_solution: TargetSolution, water: IrrigationWater):
        
        self.properties = {prop: 0.0 for prop in (PROPS + ['ph', 'conductivity'])}

        self.target: TargetSolution = ideal_solution
        self.water: IrrigationWater = water

        # This stores the fertilizers currently applied to the solution
        self.active_fertilizers: List[FertilizerQuantity] = []
        # This stores the fertilizers that are applied to the solution
        # while doing calculations. When commit_fertilizers() is called,
        # they are moved to active_fertilizers
        self.draft_fertilizers: List[FertilizerQuantity] = []

        self.candidate_fertilizers: List[Fertilizer] = []

        self.intakes = self.get_intakes()


    def commit_fertilizers(self):
        self.active_fertilizers = self.draft_fertilizers.copy()
        return


    # This account only for the intakes necessary to reach the target from the water
    def get_intakes(self) -> dict:
        return {prop: self.target.properties()[prop]-self.water.properties()[prop] for prop in PROPS}

    # This accounts for the intakes from water + active fertilizers
    def nutrient_differences(self) -> dict:
        return {prop: self.intakes[prop] - 
                sum(fert.properties()[prop] for fert in self.draft_fertilizers) for prop in PROPS}
    

    # Create matrix of possible fertilizers
    def candidate_fertilizers_matrix(self):
        poss_fert_matrix = np.array([[fert.properties()[prop] for prop in PROPS] for fert in self.candidate_fertilizers])
        self.candidate_fertilizers_matrix = poss_fert_matrix
        return poss_fert_matrix
    
    # Create matrix of active fertilizers
    def fertilizers_matrix(self):
        fert_matrix = np.array([[fert.properties()[prop] for prop in PROPS] for fert in self.active_fertilizers])
        self.fertilizers_matrix = fert_matrix
        return fert_matrix
    
    # Create vector of nutrient differences
    def differences_vector(self):
        diffs = np.array([self.nutrient_differences()[prop] for prop in PROPS])
        self.differences_vector = diffs
        return diffs
    


    def combine_fertilizers(
            self,
            ferts: List[Fertilizer], 
            target_prop: str, 
            do_not_exceed: List[str]=[]):
        """
        Combine arbitrary number of fertilizers to:
        - Hit nutrient "prop" exactly
        - Keep do-not-exceed components <= target
        - Coefficients >= 0
        - Dynamically maximize number of additional components hit
        """

        # If there is only one fertilizer, fallback to simple adjustment
        if len(ferts) == 1:
            max_qty = min(
                (self.nutrient_differences()[prop] / ferts[0].properties()[prop] if ferts[0].properties()[prop] > 0 else float('inf'))
                for prop in PROPS
            )
            self.draft_fertilizers.append(FertilizerQuantity(ferts[0], max_qty))
            return [max_qty], self.nutrient_differences()

        # Fertilizers matrix (coleection of vectors)
        vectors = np.array([[fert.properties()[prop] for prop in PROPS] for fert in ferts], dtype=float)
        # Target vector
        target = np.array([self.nutrient_differences()[prop] for prop in PROPS], dtype=float)
        # Index to hit exactly
        primary_index = PROPS.index(target_prop)
        # Indices to not exceed
        if do_not_exceed is []:
            do_not_hit = None
        else:
            do_not_hit = [PROPS.index(prop) for prop in do_not_exceed if prop in PROPS]

        num_vectors, dim = vectors.shape
        if do_not_hit is None:
            do_not_hit = []

        # Start with prop to hit only
        A_eq = np.array([vectors[:, primary_index]])
        b_eq = np.array([target[primary_index]])
        hit_indices = []

        remaining_indices = [i for i in range(dim) if i != primary_index and i not in do_not_hit]

        # Iteratively try to add other components greedily
        for idx in remaining_indices:
            A_eq_candidate = np.vstack([A_eq, vectors[:, idx]])
            b_eq_candidate = np.append(b_eq, target[idx])
            
            # Inequality constraints for do-not-hit and components not in equality
            ineq_indices = [i for i in range(dim) if i not in np.append([primary_index], hit_indices + [idx])]
            # if do_not_hit:
            #     ineq_indices += do_not_hit
            if ineq_indices:
                A_ub = vectors[:, ineq_indices].T
                b_ub = target[ineq_indices]
            else:
                A_ub = None
                b_ub = None

            # Solve LP: minimize 0 (we just want feasibility)
            res = linprog(c=np.zeros(num_vectors), A_ub=A_ub, b_ub=b_ub, A_eq=A_eq_candidate, b_eq=b_eq_candidate, bounds=(0, None))
            
            if res.success:
                # Component can be hit, accept it
                A_eq = A_eq_candidate
                b_eq = b_eq_candidate
                hit_indices.append(idx)
        
        # Final solve for chosen components
        res_final = linprog(c=np.zeros(num_vectors), A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=(0, None))
        if not res_final.success:
            # Fallback: hit primary only, distribute coefficients proportionally
            primary_sum = sum(vectors[:, primary_index])
            if primary_sum == 0:
                raise ValueError("Cannot hit primary target: all vectors zero in target_index")
            coefficients = np.array([target[primary_index]/primary_sum]*num_vectors)
        else:
            coefficients = res_final.x


        hit_props = [PROPS[i] for i in hit_indices]
        
        fert_list = [FertilizerQuantity(fert, qty) for fert, qty in zip(ferts, coefficients)]

        # Add fertilizers to draft list
        self.draft_fertilizers.extend(fert_list)

        return coefficients, hit_props, self.nutrient_differences()
    

    '''
    This code here serves as a filter to see if a new fertilizer can be added to the draft list
    whithout sending one of the previous fertilizer to zero.
    '''
    def _build_constraints(vectors, target, primary_index, do_not_hit=None):
        """
        Returns A_eq, b_eq, A_ub, b_ub for the constraints described.
        - vectors: array shape (n_vectors, dim)
        - target: array shape (dim,)
        - primary_index: index of equality constraint
        - do_not_hit: list of indices that must be <= target (they are included in inequalities)
        """
        vectors = np.asarray(vectors, dtype=float)
        target = np.asarray(target, dtype=float)
        n_vec, dim = vectors.shape

        # equality: primary_index
        A_eq = vectors[:, primary_index].reshape(1, n_vec)   # shape (1, n_vec)
        b_eq = np.array([target[primary_index]], dtype=float)

        # inequality: all indices except those we are treating by equality in tests
        # but here we produce full-inequality form; caller will select subset if needed
        A_ub = vectors.T    # shape (dim, n_vec) so A_ub * x <= target
        b_ub = target.copy()

        return A_eq, b_eq, A_ub, b_ub

    def check_third_vector_effect(vectors, target, primary_index, new_vector_index,
                                do_not_hit=None, eps=1e-8, linprog_options=None):
        """
        Determine whether adding the vector at new_vector_index can be done without forcing
        any of the existing coefficients to zero.

        Parameters
        ----------
        vectors : array-like, shape (n_vectors, dim)
            Row i is vector i.
        target : array-like, shape (dim,)
        primary_index : int
            Index of the component that must be hit exactly.
        new_vector_index : int
            Index of the candidate vector to add (e.g. 2 for v3 if v1,v2 are 0,1).
        do_not_hit : list-like or None
            Indices that must be <= target (they are treated as inequalities always).
        eps : float
            Small positive threshold to treat "strictly positive".
        linprog_options : dict or None
            Options forwarded to scipy.optimize.linprog.

        Returns
        -------
        result : dict with keys
            - all_positive_possible : bool  (is there feasible x with alpha>=eps,beta>=eps,gamma>=eps?)
            - requires_zero_index : None or index (if adding new vector forces one existing coeff to zero)
                For two existing vectors this will be 0 or 1 if that coeff must be zero.
            - feasible_with_new_positive : bool (is there any solution with gamma >= eps?)
            - diagnostics : dict with raw feasibility booleans for different tests
        """
        if linprog_options is None:
            linprog_options = {'method': 'highs'}
        vectors = np.asarray(vectors, dtype=float)
        target = np.asarray(target, dtype=float)
        n_vec, dim = vectors.shape
        if do_not_hit is None:
            do_not_hit = []

        # Build base constraints
        A_eq_full, b_eq_full, A_ub_full, b_ub_full = _build_constraints(vectors, target, primary_index, do_not_hit)

        # Helper to run feasibility LP with lower bounds given as list of (low, high) for each coefficient
        def lp_feasible(lower_bounds):
            # bounds for linprog: list of (low, None) for each coefficient
            bounds = [(max(lb, 0.0), None) for lb in lower_bounds]
            # But we must exclude equality rows from A_ub (linprog requires consistent dims)
            # We'll keep all inequality rows, linprog will enforce them.
            res = linprog(c=np.zeros(n_vec),
                        A_ub=A_ub_full, b_ub=b_ub_full,
                        A_eq=A_eq_full, b_eq=b_eq_full,
                        bounds=bounds,
                        options=linprog_options)
            return res.success

        # We're interested in the coefficient indices: assume new_vector_index is the "third"
        # existing indices are those != new_vector_index. We'll detect them:
        existing_inds = [i for i in range(n_vec) if i != new_vector_index]
        if len(existing_inds) < 2:
            # If less than 2 existing, adjust logic accordingly; but user asked about 2 existing + 1 new.
            pass

        # Build lower bound vectors
        # Test A: all three positive (alpha>=eps, beta>=eps, gamma>=eps)
        lb_all_pos = [0.0]*n_vec
        lb_all_pos[existing_inds[0]] = eps
        if len(existing_inds) > 1:
            lb_all_pos[existing_inds[1]] = eps
        lb_all_pos[new_vector_index] = eps

        all_pos_ok = lp_feasible(lb_all_pos)

        # Test B: alpha>=eps, gamma>=eps, beta>=0 (i.e. allow beta=0)
        lb_alpha_gamma = [0.0]*n_vec
        lb_alpha_gamma[existing_inds[0]] = eps
        if len(existing_inds) > 1:
            lb_alpha_gamma[existing_inds[1]] = 0.0
        lb_alpha_gamma[new_vector_index] = eps
        alpha_gamma_ok = lp_feasible(lb_alpha_gamma)

        # Test C: beta>=eps, gamma>=eps, alpha>=0
        lb_beta_gamma = [0.0]*n_vec
        if len(existing_inds) > 1:
            lb_beta_gamma[existing_inds[1]] = eps
        lb_beta_gamma[existing_inds[0]] = 0.0
        lb_beta_gamma[new_vector_index] = eps
        beta_gamma_ok = lp_feasible(lb_beta_gamma)

        # Test D: any positive gamma allowed (alpha,beta >=0)
        lb_gamma_only = [0.0]*n_vec
        lb_gamma_only[new_vector_index] = eps
        gamma_only_ok = lp_feasible(lb_gamma_only)

        # Interpret results
        requires_zero_index = None
        if all_pos_ok:
            requires_zero_index = None  # can add third vector while keeping both existing > 0
        else:
            # If cannot keep all >0, but can if one existing is zero -> that existing must be zero
            if alpha_gamma_ok and (not beta_gamma_ok):
                # Means alpha>0 & gamma>0 feasible while beta can be zero, but not the other way
                requires_zero_index = existing_inds[1] if len(existing_inds)>1 else None
            elif beta_gamma_ok and (not alpha_gamma_ok):
                requires_zero_index = existing_inds[0]
            elif alpha_gamma_ok and beta_gamma_ok:
                # both single-zero variants feasible, but all-three not: it means at least one of the existing coefficients must be zero,
                # but which one is not uniquely forced — either could be zero in some feasible solution.
                requires_zero_index = 'one_of_existing'  # ambiguous: one of them must be zero but either works
            else:
                # neither single-zero variant feasible:
                if gamma_only_ok:
                    # gamma can be >0 only if maybe both existing become zero (or more complicated)
                    requires_zero_index = 'both_may_need_to_zero_or_rearrange'
                else:
                    # Even gamma alone is not feasible with equality primary -> cannot add positive gamma at all
                    requires_zero_index = 'cannot_add_positive_gamma'

        return {
            'all_positive_possible': all_pos_ok,
            'feasible_with_new_positive': gamma_only_ok,
            'alpha_gamma_ok': alpha_gamma_ok,
            'beta_gamma_ok': beta_gamma_ok,
            'requires_zero_index': requires_zero_index,
            'diagnostics': {
                'all_pos_ok': all_pos_ok,
                'alpha_gamma_ok': alpha_gamma_ok,
                'beta_gamma_ok': beta_gamma_ok,
                'gamma_only_ok': gamma_only_ok
            }
        }


# manager_manual = SolucionNutritivaManagerManual()


if __name__ == "__main__":
    
    water = IrrigationWater(
        id=1,
        name="Agua de riego",
        no3=0.42,
        h2po4=0.0,
        so4=1.13,
        hco3=5.52
    )

    fert1 = Fertilizer(
        id=1,
        name="Fertilizante 1",
        h2po4=1.0,
        hco3=-1.0
    )

    fert2 = Fertilizer(
        id=2,
        name="Fertilizante 2",
        no3=1.0,
        hco3=-1.0
    )

    ideal_solution = TargetSolution(
        name="Solución ideal",
        no3=12.0,
        h2po4=2.0,
        so4=2.32,
        hco3=0.5
    )


    manager = SolucionNutritivaManager(ideal_solution, water)

    sol = manager.combine_fertilizers([fert1, fert2], target_prop='hco3')

    print(sol)



   

