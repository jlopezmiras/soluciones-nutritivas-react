import { Box, SimpleGrid, Text, HStack, Tag, Input, Select, Button, Collapse, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import api from "../../api";
import { useEffect, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";



// Map nutrient strings to formatted JSX
const NUTRIENT_MAP: Record<string, React.ReactNode> = {
  no3: <>NO<sub>3</sub></>,
  h2po4: <>H<sub>2</sub>PO<sub>4</sub></>,
  so4: <>SO<sub>4</sub></>,
  hco3: <>HCO<sub>3</sub></>,
  cl: <>Cl</>,
  na: <>Na</>,
  ca: <>Ca</>,
  mg: <>Mg</>,
  k: <>K</>,
  nh4: <>NH<sub>4</sub></>,
};

const LIQUID_SOLID_MAP: Record<string, string> = {
    s: 'sólido',
    l: 'líquido'
}

type Fertilizer = {
  name: string;
  nutrients: string[];
  state: string;
};

interface FertilizerGridProps {
    onFertClick: (fertName: string) => void;
};


function FertilizerGrid({ onFertClick }: FertilizerGridProps) {

    const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);
    const [searchName, setSearchName] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);

    const fetchFertilizers = async (): Promise<Fertilizer[]> => {
        try {
            const response = await api.get<Fertilizer[]>("/manager/manual/fertilizers");
            console.log(response.data); 
            return response.data;
        } catch (error) {
            console.error("Error fetching manual:", error);
            throw error;
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchFertilizers();
                setFertilizers(data);
            } catch (error) {
                console.error("Failed to fetch fertilizers:", error);
            } finally {
                
            }
        };
        getData();
    }, []);


    // Toggle nutrient selection
  const toggleNutrient = (nutrient: string) => {
    setSelectedNutrients(prev =>
      prev.includes(nutrient)
        ? prev.filter(n => n !== nutrient)
        : [...prev, nutrient]
    );
  };

  // Filter fertilizers by name and selected nutrients
  const filteredFertilizers = useMemo(() => {
    return fertilizers.filter(f => {
      const matchesName = f.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesNutrients =
        selectedNutrients.length === 0 ||
        selectedNutrients.every(n => f.nutrients.includes(n));
      return matchesName && matchesNutrients;
    });
  }, [fertilizers, searchName, selectedNutrients]);


  const handleAddFertilizer = async (name: string) => {
    try {
    await api.post("/manager/manual/add-fertilizer", { fert_name: name });
    } catch (error) {
    console.error("Error adding fertilizer:", error);
    }
};

  return (
    <Box flex="1" overflowY="auto" minHeight={0}>
      {/* Top controls */}
      <HStack spacing={4} mb={4} maxW={"1000px"}>
        <InputGroup>
            <Input
                placeholder="Buscar fertilizante..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                borderRadius={"full"}
            />
            <InputRightElement>
                <FiSearch />
            </InputRightElement>
        </InputGroup>
        <IconButton 
            aria-label="Filtros" 
            icon={<FiFilter />}
            onClick={() => setFilterOpen(!filterOpen)} 
        />
      </HStack>

      {/* Nutrient filter pills */}
      <Collapse in={filterOpen} animateOpacity>
        <HStack spacing={2} mb={4} wrap="wrap">
          {Object.keys(NUTRIENT_MAP).map(nutrient => (
            <Tag
              key={nutrient}
              size="lg"
              variant={selectedNutrients.includes(nutrient) ? "solid" : "subtle"}
              borderRadius="full"
              borderWidth="2px"
              cursor="pointer"
              onClick={() => toggleNutrient(nutrient)}
            >
              {NUTRIENT_MAP[nutrient]}
            </Tag>
          ))}
        </HStack>
      </Collapse>

      {/* Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {filteredFertilizers.map(fertilizer => (
          <Box
            key={fertilizer.name}
            borderWidth="1px"
            borderRadius="xl"
            p={4}
            shadow="sm"
            _hover={{ shadow: "md", bg: "gray.50" }}
            transition="all 0.2s"
            onClick={() => {handleAddFertilizer(fertilizer.name); // This adds the fertilizer to the manager
                            onFertClick(fertilizer.name); // This updates the table
            }
                    }
          >
            <HStack spacing={3}>
              <Text fontWeight="semibold" fontSize="md">
                {fertilizer.name}
              </Text>
              <Text>({LIQUID_SOLID_MAP[fertilizer.state]})</Text>
            </HStack>
            <HStack spacing={2} mt={2} wrap="wrap">
              {fertilizer.nutrients.map(nutrient => (
                <Tag key={nutrient} size="sm" variant="subtle" colorScheme="teal">
                  {NUTRIENT_MAP[nutrient]}
                </Tag>
              ))}
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}


export default FertilizerGrid