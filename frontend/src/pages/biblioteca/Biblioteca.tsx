import React, { useState } from "react";
import type { ChangeEvent } from "react";
import Sidebar from "../../components/SideBar";
import RightPanel from "./RightPanel";
import {
  Box,
  Flex,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiDroplet, FiBox, FiHome } from "react-icons/fi";
import IrrigationWaterForm from "./IrrigationWaterForm";
import FertilizantsForm from "./FertilizantsForm";
import SolutionsForm from "./SolutionsForm";
import api from "../../api";

// Tipado de cada item de la tabla
interface Item {
  id: number;
  nombre: string;
  descripcion: string;
}

// Encabezados completos
const fullHeaders = [
  "Nombre",
  "pH",
  "Conductividad",
  "Fecha",
  "Observaciones",
];



const Biblioteca: React.FC = () => {

  const [activeOption, setActiveOption] = useState<"table" | "form">("table");
  const [activeTable, setActiveTable] = useState<"watering" | "fertilizers" | "solutions">("watering");
  const [currentPanelKey, setCurrentPanelKey] = useState<string>("");



  const handleAdd = (panelKey: string) => {
    setCurrentPanelKey(panelKey);
    setActiveOption("form");
  };

  const handleBackToTable = () => {
    setActiveOption("table");
    setCurrentPanelKey("");
  };


  const sidebarItems = [
  { key: 'watering', label: 'Aguas de riego', icon: FiDroplet },
  { key: 'fertilizers', label: 'Fertilizantes', icon: FiBox },
  { key: 'solutions', label: 'Soluciones nutritivas', icon: FiHome },
];


  // const filteredData = tableData[activeOption].filter((item) =>
  //   item.nombre.toLowerCase().includes(search.toLowerCase())
  // );


  return (
    <Flex h="100%" w="100%" alignItems="flex-start">
      <Sidebar 
        items={sidebarItems}
        onItemClick={(item) => setActiveTable(item.key as any)}
      />

      {activeOption === "table" && (
        <RightPanel
          title={sidebarItems.find((i) => i.key === activeTable)?.label || ''}
          panelKey={activeTable}
          onAdd={handleAdd}
        />
      )}

      {activeOption === "form" && currentPanelKey === "watering" && (
          <IrrigationWaterForm onBack={() => setActiveOption("table")}/>
      )}
      {activeOption === "form" && currentPanelKey === "fertilizers" && (
        <Box flex="0 0 auto" alignSelf="flex-start" maxW="1000px" >
          <FertilizantsForm/>
        </Box>
      )}
      {activeOption === "form" && currentPanelKey === "solutions" && (
        <SolutionsForm onBack={() => setActiveOption("table")}/>
      )}
    </Flex>
  );

};

export default Biblioteca;
