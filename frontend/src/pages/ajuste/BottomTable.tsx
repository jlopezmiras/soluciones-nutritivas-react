import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiGrid, FiTable } from "react-icons/fi";
import ThreeCardLayout from "./ThreeCardLayout"; // tu layout de cards
import TopTable from "./TopTable"; // una tabla simple



const data = [
    {
      Sustancia: "Agua de pozo",
      Cantidad: "1000 L",
      Nitrato: "15 mg/L",
      Fósforo: "0.5 mg/L",
      Sulfato: "12 mg/L",
      Bicarbonato: "120 mg/L",
      Cloruro: "30 mg/L",
      Sodio: "25 mg/L",
      Calcio: "40 mg/L",
      Magnesio: "10 mg/L",
      Potasio: "5 mg/L",
    },
    {
      Sustancia: "Agua de río",
      Cantidad: "800 L",
      Nitrato: "10 mg/L",
      Fósforo: "0.8 mg/L",
      Sulfato: "8 mg/L",
      Bicarbonato: "100 mg/L",
      Cloruro: "20 mg/L",
      Sodio: "18 mg/L",
      Calcio: "35 mg/L",
      Magnesio: "12 mg/L",
      Potasio: "6 mg/L",
    },
    {
      Sustancia: "Agua tratada",
      Cantidad: "1200 L",
      Nitrato: "5 mg/L",
      Fósforo: "0.2 mg/L",
      Sulfato: "5 mg/L",
      Bicarbonato: "110 mg/L",
      Cloruro: "15 mg/L",
      Sodio: "20 mg/L",
      Calcio: "38 mg/L",
      Magnesio: "9 mg/L",
      Potasio: "4 mg/L",
    },
    {
      Sustancia: "Agua mineral",
      Cantidad: "500 L",
      Nitrato: "2 mg/L",
      Fósforo: "0.1 mg/L",
      Sulfato: "3 mg/L",
      Bicarbonato: "90 mg/L",
      Cloruro: "12 mg/L",
      Sodio: "10 mg/L",
      Calcio: "45 mg/L",
      Magnesio: "8 mg/L",
      Potasio: "3 mg/L",
    },
  ];


function BottomTable() {
  const [view, setView] = useState<"cards" | "table">("cards");

  const bg = useColorModeValue("gray.100", "gray.800");

  return (
    <Box position="relative" p={4}>
      {/* Contenedor principal */}
      <Box height="100%" overflow="auto">
        {view === "cards" ? <ThreeCardLayout /> : <TopTable data={data} />}
      </Box>

      {/* Iconos abajo a la derecha */}
      <Flex justify="flex-end" mt={2} gap={2}>
        <IconButton
          aria-label="Mostrar cards"
          icon={<FiGrid />}
          colorScheme={view === "cards" ? "teal" : "gray"}
          onClick={() => setView("cards")}
        />
        <IconButton
          aria-label="Mostrar tabla"
          icon={<FiTable />}
          colorScheme={view === "table" ? "teal" : "gray"}
          onClick={() => setView("table")}
        />
      </Flex>
    </Box>
  );
}


export default BottomTable;
