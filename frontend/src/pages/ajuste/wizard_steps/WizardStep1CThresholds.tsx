import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Input,
  VStack,
  Text,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  HStack,
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


export default function WizardStep1CThresholds({ data, setData }: StepProps) {
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("teal.100", "teal.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [thresholdNutrients, setThresholdNutrients] = useState<string[]>([])

  // See what nutrients were not set as targets
  useEffect(() => {
    const nuttarg = Object.keys(data.solution.targets);
    console.log(nuttarg);
    setThresholdNutrients(NUTRIENTS.filter((nutrient) => !(nuttarg.includes(nutrient))));
  }, [data]);

  useEffect(() => {
    const nuttarg = Object.keys(data.solution.targets);
    setThresholdNutrients(NUTRIENTS.filter((nutrient) => !(nuttarg.includes(nutrient))));
  }, []);

  

  const handleChangeMin = (nutrient: string, value: string) => {
    // const numeric = parseFloat(value) || 0;
    setData((prev: any) => ({
      solution: {
        ...prev.solution,
        thresholds: { 
          min: {...prev.solution.thresholds.min, [nutrient]: value },
          max: {...prev.solution.thresholds.max}
        }
      },
      water: { ...prev.water },
    }));
  };

  const handleChangeMax = (nutrient: string, value: string) => {
    // const numeric = parseFloat(value) || 0;
    setData((prev: any) => ({
      solution: {
        ...prev.solution,
        thresholds: { 
          max: {...prev.solution.thresholds.max, [nutrient]: value },
          min: {...prev.solution.thresholds.min}
        }
      },
      water: { ...prev.water },
    }));
  };

  return (
    <Box ml={10}>
      <Heading size="md" mb={4}>
        Paso 4: Establecer umbrales mínimos y máximos
      </Heading>

      <Text mb={4} color="gray.500">
        Define los nutrientes que pueden estar presentes, siempre y cuando se encuentren en un cierto rango.
        <br />
        Un valor mínimo vacío se sobreentenderá como un cero.
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {thresholdNutrients.map((nutrient) => {
          const valueMax = data.solution.thresholds.max[nutrient] ?? "";
          const valueMin = data.solution.thresholds.min[nutrient] ?? "";

          return (
            <Box
              key={nutrient}
              p={4}
              borderWidth="1px"
              borderRadius="xl"
              borderColor={borderColor}
              bg={cardBg}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.03)" }}
            >
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">{NUTRIENT_MAP[nutrient]}</Text>
                <HStack spacing={2}>
                  <NumberInput
                    min={0}
                    step={0.001}
                    precision={3}
                    value={data.solution.thresholds.min[nutrient] ?? ""}
                    fontFamily={"mono"}
                    onChange={(value) =>
                      handleChangeMin(nutrient, value)}
                    w="150px"
                  >
                    <NumberInputField placeholder="Valor mín." />
                  </NumberInput>
                  <Text>&mdash;</Text>
                  <NumberInput
                    min={0}
                    step={0.001}
                    precision={3}
                    value={data.solution.thresholds.max[nutrient] ?? ""}
                    fontFamily={"mono"}
                    onChange={(value) =>
                      handleChangeMax(nutrient, value)}
                    w="150px"
                  >
                    <NumberInputField placeholder="Valor máx." />
                  </NumberInput>
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
