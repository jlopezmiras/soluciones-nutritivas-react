import React from "react";
import {
  Box,
  Heading,
  HStack,
  Tag,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const NUTRIENTS = ["no3", "h2po4", "so4", "k", "ca", "mg", "nh4", "cl", "na", "hco3"];

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

export default function WizardStep1BLock({ data, setData }: StepProps) {
  const bgSelected = useColorModeValue("blue.100", "blue.700");
  const borderColor = useColorModeValue("blue.400", "blue.300");
  const textSelected = useColorModeValue("blue.800", "white");

  const toggleLock = (nutrient: string) => {
    setData((prev: any) => {
      const locked = prev.solution.locked.includes(nutrient)
        ? prev.solution.locked.filter((n: string) => n !== nutrient)
        : [...prev.solution.locked, nutrient];
      return {
         solution: {
          ...prev.solution,
          locked: locked
         },
        water : { ...prev.water }  
      };
    });
  };


  return (
    <Box>
      <Heading size="md" mb={4}>
        Paso 2: Bloquear nutrientes
      </Heading>
      <Text mb={4} color="gray.500">
        Selecciona los nutrientes que **no** deseas modificar. Mantendrán su concentración original del agua de riego.
      </Text>

      <VStack align="start" spacing={3}>
        <HStack wrap="wrap" spacing={3}>
          {NUTRIENTS.map((nutrient) => {
            const selected = data.solution.locked.includes(nutrient);
            return (
              <Tag
                key={nutrient}
                size="lg"
                borderRadius="full"
                px={4}
                py={2}
                cursor="pointer"
                borderWidth="2px"
                borderColor={selected ? borderColor : "gray.300"}
                bg={selected ? bgSelected : "transparent"}
                color={selected ? textSelected : "gray.600"}
                fontWeight={selected ? "bold" : "medium"}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.05)" }}
                onClick={() => toggleLock(nutrient)}
              >
                {NUTRIENT_MAP[nutrient]}
              </Tag>
            );
          })}
        </HStack>
      </VStack>
    </Box>
  );
}
