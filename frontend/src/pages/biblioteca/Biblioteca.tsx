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



const tableData = {
  watering: 
  [
  {
    Nombre: "Muestra A",
    pH: 6.17,
    Conductividad: 1078.1,
    Fecha: "2025-09-12",
    Observaciones: "Valores dentro de lo esperado",
  },
  {
    Nombre: "Pozo Sur",
    pH: 6.33,
    Conductividad: 848.5,
    Fecha: "2025-09-03",
    Observaciones: "Todo en orden",
  },
  {
    Nombre: "Depósito 1",
    pH: 6.4,
    Conductividad: 1279.5,
    Fecha: "2025-08-20",
    Observaciones: "Revisión semanal completada",
  },
  {
    Nombre: "Tanque Principal",
    pH: 7.2,
    Conductividad: 1343.9,
    Fecha: "2025-08-24",
    Observaciones: "Nivel estable",
  },
  {
    Nombre: "Depósito 1",
    pH: 6.81,
    Conductividad: 682.8,
    Fecha: "2025-08-25",
    Observaciones: "Ligera variación detectada",
  },
  {
    Nombre: "Muestra B",
    pH: 7.05,
    Conductividad: 1422.3,
    Fecha: "2025-09-10",
    Observaciones: "Posible contaminación",
  },
  {
    Nombre: "Pozo Norte",
    pH: 6.55,
    Conductividad: 999.4,
    Fecha: "2025-09-01",
    Observaciones: "Calibrar sensores pronto",
  },
  {
    Nombre: "Tanque Principal",
    pH: 7.35,
    Conductividad: 1205.8,
    Fecha: "2025-09-07",
    Observaciones: "Medición repetida",
  },
  {
    Nombre: "Muestra A",
    pH: 6.9,
    Conductividad: 678.2,
    Fecha: "2025-09-11",
    Observaciones: "Todo en orden",
  },
  {
    Nombre: "Depósito 2",
    pH: 7.12,
    Conductividad: 1350.7,
    Fecha: "2025-08-30",
    Observaciones: "En rango permitido",
  },
  ],

  fertilizers: [],

  solutions: []

};


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
          data={tableData[activeTable] || []}
          onAdd={handleAdd}
        />
      )}

      {activeOption === "form" && currentPanelKey === "watering" && (
        <Box flex="0 0 auto" maxW="1000px">
          <IrrigationWaterForm onBack={() => setActiveOption("table")}/>
        </Box>
      )}
      {activeOption === "form" && currentPanelKey === "fertilizers" && (
        <Box flex="0 0 auto" alignSelf="flex-start" maxW="1000px" >
          <FertilizantsForm/>
        </Box>
      )}
      {activeOption === "form" && currentPanelKey === "solutions" && (
        <SolutionsForm />
      )}
    </Flex>
  );

};

export default Biblioteca;
