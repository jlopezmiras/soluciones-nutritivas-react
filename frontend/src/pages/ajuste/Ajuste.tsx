import React from "react";
import { useState } from "react";
import { Text, 
  Box, 
  Heading,
  useColorModeValue,
  Button,
  HStack, 
  IconButton, 
  Input, 
  InputGroup, 
  InputRightElement,
 } from "@chakra-ui/react";

import TopTable from "./TopTable";
import { FiSearch, FiFilter, FiPlus, FiEdit, FiEye } from "react-icons/fi";
import BottomTable from "./BottomTable";


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

function Ajuste() {

  const title="Mi solución nutritiva";

  const headingColor = useColorModeValue("light.primary.main","dark.accent.main");
  // const bgTableColor = useColorModeValue("light.primary.50","dark.background.800");
  const tableHeaderColor = useColorModeValue("light.background.100","dark.background.800");


  // State variables
  const [showAddElements, setShowAddElements] = useState(false);

  const handleAddElementsClick = () => {setShowAddElements(!showAddElements);};
  const handleEnableEditClick = () => {alert("Funcionalidad de habilitar edición no implementada aún.");};
  const handleViewResultClick = () => {alert("Funcionalidad de ver resultado no implementada aún.");};


  return (
  <Box flex="1" p={6} pl={20} pt={2} display="flex" flexDirection="column" height="100vh-20px">


  <HStack mb={6} justify="space-between" w="100%">
    <Heading 
    color={headingColor}
    >
      {title}
    </Heading>

    <HStack spacing={4}>
      {/* Botón para habilitar edición */}
      <Button leftIcon={<FiEdit/>} colorScheme="yellow" onClick={handleEnableEditClick}>
        Habilitar edición
      </Button>

      {/* Botón para ver resultado */}
      <Button leftIcon={<FiEye/>} colorScheme="blue" onClick={handleViewResultClick}>
        Ver resultado
      </Button>

      {/* Botón de añadir, si lo quieres mantener */}
      <Button leftIcon={<FiPlus />} colorScheme="teal" onClick={handleAddElementsClick}>
        Añadir componentes
      </Button>
    </HStack>


  </HStack>
  
  <TopTable data={data}/>

  {/* Second table for bottom part */}
  {showAddElements && <BottomTable/>}

  </Box>
  )
}


export default Ajuste;