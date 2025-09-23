import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  VStack,
  Flex,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

interface CardProps {
  title: string;
  items: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  clearOthers: () => void;
  singleSelect?: boolean; // true = solo se puede seleccionar 1
}

const SearchableCard: React.FC<CardProps> = ({
  title,
  items,
  selectedItems,
  setSelectedItems,
  clearOthers,
  singleSelect = false,
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const rowHover = useColorModeValue("gray.100", "gray.600");
  const rowSelected = useColorModeValue("teal.200", "teal.500");
  const rowSelectedHover = useColorModeValue("teal.300", "teal.600");

  const toggleSelect = (item: string) => {
    clearOthers();

    if (singleSelect) {
      // Si es selección única, solo marca este item
      setSelectedItems(selectedItems.includes(item) ? [] : [item]);
    } else {
      // Selección múltiple
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  return (
    <Box
      flex={1}
      p={4}
      bg={bgColor}
      borderRadius="xl"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      minHeight="350px"
    >
      <Heading size="md" mb={3}>
        {title}
      </Heading>

      <Input
        placeholder={`Buscar en ${title}...`}
        mb={3}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        borderRadius="full"
      />

      <VStack spacing={1} align="stretch" overflowY="auto" flex="1" mb={3}>
        {filteredItems.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <Box
              key={item}
              p={2}
              borderRadius="md"
              cursor="pointer"
              bg={isSelected ? rowSelected : undefined}
              _hover={{
                bg: isSelected ? rowSelectedHover : rowHover,
              }}
              onClick={() => toggleSelect(item)}
            >
              <Text>{item}</Text>
            </Box>
          );
        })}
      </VStack>

      <Flex justify="flex-end">
        <Button
          colorScheme="teal"
          onClick={() => alert(`Añadidos: ${selectedItems.join(", ")}`)}
          isDisabled={selectedItems.length === 0}
        >
          Añadir
        </Button>
      </Flex>
    </Box>
  );
};

export default function ThreeCardLayout() {
  const solutions = ["Solución A", "Solución B", "Solución C", "Solución D"];
  const irrigationWaters = ["Agua de pozo", "Agua de río", "Agua tratada"];
  const fertilizers = ["Fertilizante 1", "Fertilizante 2", "Fertilizante 3"];

  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [selectedWaters, setSelectedWaters] = useState<string[]>([]);
  const [selectedFertilizers, setSelectedFertilizers] = useState<string[]>([]);

  const clearOthers = (except: string) => {
    if (except !== "solutions") setSelectedSolutions([]);
    if (except !== "waters") setSelectedWaters([]);
    if (except !== "fertilizers") setSelectedFertilizers([]);
  };

  return (
    <Flex gap={4} p={6}>
      <SearchableCard
        title="Soluciones nutritivas"
        items={solutions}
        selectedItems={selectedSolutions}
        setSelectedItems={setSelectedSolutions}
        clearOthers={() => clearOthers("solutions")}
        singleSelect={true} // solo se puede seleccionar 1
      />
      <SearchableCard
        title="Aguas de riego"
        items={irrigationWaters}
        selectedItems={selectedWaters}
        setSelectedItems={setSelectedWaters}
        clearOthers={() => clearOthers("waters")}
        singleSelect={true} // solo se puede seleccionar 1
      />
      <SearchableCard
        title="Fertilizantes"
        items={fertilizers}
        selectedItems={selectedFertilizers}
        setSelectedItems={setSelectedFertilizers}
        clearOthers={() => clearOthers("fertilizers")}
        singleSelect={false} // selección múltiple
      />
    </Flex>
  );
}
