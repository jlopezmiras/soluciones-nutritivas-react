import React from "react";
import { Box, Heading, VStack, HStack, NumberInput, NumberInputField, Text, Tag, useColorModeValue, Tooltip, Icon } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { HiArrowLongLeft } from "react-icons/hi2";

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

const formatStyledValue = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "";
  return (
    <Text as="span" fontSize="lg" fontFamily="mono">
      {num.toFixed(2)}
    </Text>
  );
};

const formatValue = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "";
  return (num.toFixed(2));
};

export default function WizardStep1ATargets({ data, setData }: StepProps) {

  // Numeric Inputs
  const handleChange = (nutrient: string, value: string) => {
    // const numeric = parseFloat(value) || 0; 
    if (value==="") {
      const newTargets = { ...data.solution.targets };
      delete newTargets[nutrient];
      console.log(newTargets);
      setData((prev: any) => ({
        solution: {
          ...prev.solution,
          targets: { ...newTargets },
        },
        water: { ...prev.water },
      }));
    } else {
      setData((prev: any) => ({
        solution: {
          ...prev.solution,
          targets: { ...prev.solution.targets, [nutrient]: value },
        },
        water: { ...prev.water },
      }));
    }
  };

  // Selected Tags
  const bgSelected = useColorModeValue("blue.100", "blue.700");
  const borderColor = useColorModeValue("blue.400", "blue.300");
  const textSelected = useColorModeValue("blue.800", "white");

  const toggleLock = (nutrient : string) => {
    setData((prev: any) => ({
      solution: {
        ...prev.solution,
        targets: { ...prev.solution.targets, [nutrient]: prev.water[nutrient] },
      },
      water: { ...prev.water },
    }));
  }

  return (
    <Box ml={10}>
      <Heading size="md" mb={4}>
        Paso 3: Establecer los nutrientes objetivo
      </Heading>
      <Text mb={4} color="gray.500">
        Introduce las concentraciones objetivo para cada nutriente en la solución nutritiva (mmol/L). 
        Puedes hacer clic en las etiquetas para aplicar directamente la concentración del agua de riego.
        <br />    
        Podrás introducir cotas para aquellos nutrientes que no desees ajustar en el siguiente paso.
      </Text>
      <VStack align="stretch" spacing={4} ml={10} mb={8}>
        {NUTRIENTS.map((nutrient) => {
          const selected = data.solution.locked.includes(nutrient);
          return (
          <HStack key={nutrient} spacing={16}>
            <Text w="60px" fontFamily={"mono"} fontSize={"lg"}>{NUTRIENT_MAP[nutrient]}:</Text>
            <NumberInput
              min={0}
              step={0.01}
              precision={2}
              value={data.solution.targets[nutrient] ?? ""}
              fontFamily={"mono"}
              onChange={(value) => handleChange(nutrient, value)}
              w="120px"
            >
              <NumberInputField placeholder="mmol/L" />
            </NumberInput>
            <Icon as={HiArrowLongLeft} boxSize={6} p={-2} m={-10} ml={"-52px"}/>
            <Tooltip label={"Aplicar concentración del agua de riego (mmol/L)"} placement="right" hasArrow>
              <Tag
                key={nutrient}
                size="lg"
                borderRadius="xl"
                px={4}
                py={2}
                ml={-4}
                cursor="pointer"
                borderWidth="2px"
                borderColor={selected ? borderColor : "gray.300"}
                bg={selected ? bgSelected : "transparent"}
                color={selected ? textSelected : "gray.600"}
                fontWeight={selected ? "bold" : "medium"}
                transition="all 0.2s"
                width={"80px"}
                _hover={{ transform: "scale(1.05)" }}
                onClick={() => toggleLock(nutrient)}
              >
                {formatStyledValue(data.water[nutrient])}
              </Tag>
            </Tooltip>
          </HStack>
          );}
        )}
      </VStack>
    </Box>
  );
}
