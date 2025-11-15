import React, { useEffect } from "react";
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
  Spacer,
  Divider,
 } from "@chakra-ui/react";

import TopTable from "./TopTable";
import { FiSearch, FiFilter, FiPlus, FiEdit, FiEye } from "react-icons/fi";
import FertilizerGrid from "./FertilizerGrid";
import api from "../../api";
import ClassicTopTable from "./ClassicTopTable";

interface RowData {
  name : string;
  qty : number | null;
  no3 : number | number[] | null;
  h2po4 : number | number[] | null;
  so4 : number | number[] | null;
  hco3 : number | number[] | null;
  cl : number | number[] | null;
  na : number | number[] | null;
  ca : number | number[] | null;
  mg : number | number[] | null;
  k : number | number[] | null;
  nh4 : number | number[] | null;
}

interface TypeNutrient {
  [key : string] : string[];
}


function TableManager() {

  const title="Mi solución nutritiva";

  const headingColor = useColorModeValue("light.primary.main","dark.accent.main");
  // const bgTableColor = useColorModeValue("light.primary.50","dark.background.800");
  const tableHeaderColor = useColorModeValue("light.background.100","dark.background.800");


  // State variables
  const [showAddElements, setShowAddElements] = useState(false);

  const handleAddElementsClick = () => {
    setShowAddElements(!showAddElements);
  };
  const handleEnableEditClick = () => {alert("Funcionalidad de habilitar edición no implementada aún.");};
  const handleViewResultClick = () => {alert("Funcionalidad de ver resultado no implementada aún.");};


  // Update tableData from manager
  const updateTableFromManager = async () => {
    try {
        const response = await api.post("/manager/manual/create-manager");
        updateTable(response.data.data, response.data.typeNutrient);
        console.log("Manager initialized:", response.data);
      } catch (error) {
        console.error("Failed to initialize manager:", error);
      }
  };

  const updateTable = async (data : RowData[], typeNutrient : TypeNutrient) => {
        setTableData(data);
        setTypeNutrient(typeNutrient);
    };


  //Functions to upload the row when new fertilizer is clicked
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [typeNutrient, setTypeNutrient] = useState<TypeNutrient>({target: [], locked: [], threshold: []});
  const handleFertilizerClick = async (fertName: string) => {
    updateTableFromManager();
  };


  // We first run initManager once when the tableData or typeNutrient change
  useEffect(() => {
    updateTableFromManager();
  }, []);



  return (
  <Box height="calc(100vh - 120px)" display="flex" flexDirection="column" p={6} pl={8} pt={2}>
    <HStack mb={4} justify="space-between" w="100%">
      <Heading color={headingColor}>{title}</Heading>

      <HStack spacing={4}>
        <Button leftIcon={<FiEdit />} colorScheme="yellow" onClick={handleEnableEditClick}>
          Habilitar edición
        </Button>
        <Button leftIcon={<FiEye />} colorScheme="blue" onClick={handleViewResultClick}>
          Ver resultado
        </Button>
        <Button leftIcon={<FiPlus />} colorScheme="teal" onClick={handleAddElementsClick}>
          Añadir componentes
        </Button>
      </HStack>
    </HStack>

    {/* Conditional split layout */}
    <Box flex="1" display="flex" flexDirection="column" minHeight={0}>
      {/* TopTable takes 2/3 height */}
      <Box flex={showAddElements ? 2 : 1} overflowY="auto" mb={showAddElements ? 2 : 0} minHeight={0} >
        <TopTable data={tableData} typeNutrient={typeNutrient} />
        {/* <ClassicTopTable data={tableData} /> */}
      </Box>

      {showAddElements && (
        <>
          <Divider mb={4}/>
          {/* Bottom FertilizerGrid takes 1/3 */}
          <Box flex="1" overflowY="auto" minHeight={0}>
            <FertilizerGrid onFertClick={handleFertilizerClick} />
          </Box>
        </>
      )}
    </Box>
  </Box>
  )
}


export default TableManager;