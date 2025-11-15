import React, { use, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus, FiMoreVertical, FiEdit2, FiEye, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import api from '../../api';

interface RightPanelProps {
  title: string;
  panelKey: string;          // nueva prop para identificar qué panel es
  onAdd: (panelKey: string) => void;
}


interface TableRow {
  id: number;
  Nombre: string;
  pH: number;
  Conductividad: number;
  Fecha: string;
  Observaciones: string;
}


export default function RightPanel({ title, panelKey, onAdd }: RightPanelProps) {
  const [search, setSearch] = useState('');

  const headerKeys = [
  "Nombre",
  "pH",
  "Conductividad",
  "Fecha",
  "Observaciones",
];

  const headerAbbreviations = [
    "Nombre", "pH", "Conductividad", "Fecha", "Observaciones"]

  // Filtrar los datos según la búsqueda
  // const filteredData = data.filter((row) =>
  //   Object.values(row).some((val) =>
  //     String(val).toLowerCase().includes(search.toLowerCase())
  //   )
  // );

  const headingColor = useColorModeValue("light.primary.main","dark.accent.main");
  // const bgTableColor = useColorModeValue("light.primary.50","dark.background.800");
  const tableHeaderColor = useColorModeValue("light.background.100","dark.background.800");

  const handleView = (row: Record<string, any>) => {
    alert(`Ver detalles de: ${row.Nombre}`);
  };
  
  const handleEdit = (row: Record<string, any>) => {
    alert(`Editar: ${row.Nombre}`);
  };
  
  const handleDelete = async (row: TableRow) => {
    try {
      let endpoint = '';
      switch (panelKey) {
        case 'watering': endpoint = `library/waters/${row.id}/`; break;
        case 'fertilizers': endpoint = `library/fertilizers/${row.id}/`; break;
        case 'solutions': endpoint = `library/solutions/${row.id}/`; break;
      }

      await api.delete(endpoint);
      // actualizar localmente
      setTableData(prev => prev.filter(item => item.id !== row.id));
      setFilteredData(prev => prev.filter(item => item.id !== row.id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };


  // Dentro del componente
  const addNewItem = () => {
    onAdd(panelKey); // llama al callback con la key del panel
  };


  //New
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
   // Traer datos según panelKey
    useEffect(() => {
      const fetchData = async () => {
        try {
          let endpoint = '';
          switch (panelKey) {
            case 'watering': endpoint = '/library/waters/'; break;
            case 'fertilizers': endpoint = '/library/fertilizers/'; break;
            case 'solutions': endpoint = '/library/solutions/'; break;
            default: return;
          }

          const response = await api.get(endpoint);
          const rows = response.data.map((w: any) => ({
            id: w.id,
            Nombre: w.name,
            pH: w.ph,
            Conductividad: w.conductivity,
            Fecha: w.date,
            Observaciones: w.description,
          }));

          setTableData(rows);
          setFilteredData(rows);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [panelKey]);

    // Filtrar datos al buscar
    useEffect(() => {
      setFilteredData(
        tableData.filter(row =>
          Object.values(row).some(val =>
            String(val).toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    }, [search, tableData]);


  return (
    <Box flex="1" p={6} pl={20} pt={2} display="flex" flexDirection="column" height="100vh-20px">
      {/* Título */}
        <Heading 
          mb={4} 
          color={headingColor}
        >
          {title}
        </Heading>

      {/* Barra de búsqueda y botones */}
      <HStack mb={4} spacing={4}>
        <InputGroup>
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            borderRadius={"full"}
          />
          <InputRightElement>
            <FiSearch />
          </InputRightElement>
        </InputGroup>

        <IconButton aria-label="Filtros" icon={<FiFilter />} />
        <Button leftIcon={<FiPlus />} colorScheme="teal" onClick={addNewItem}>
          Añadir
        </Button>
      </HStack>

      {/* Contenedor de tabla que ocupa todo el espacio vertical restante */}
    <Box flex="1" overflowY="auto">
        <Table variant="simple" size="lg">
      <Thead zIndex={2} position="sticky" top={0}>
        <Tr>
          {headerAbbreviations.map((col) => (
            <Th
              key={col}
              position="sticky"
              top={0}
              zIndex={10}
              bg={tableHeaderColor}
              py={6}
              textTransform="none"
              fontSize="md"
              color={useColorModeValue("light.text", "dark.text")}
            >
              {col}
            </Th>
          ))}
          <Th
            position="sticky"
            top={0}
            zIndex={10}
            bg={tableHeaderColor}
            py={6}
            textTransform="none"
            fontSize="md"
            color={useColorModeValue("light.text","dark.text")}
          >
            Acciones
          </Th>
        </Tr>
      </Thead>

      <Tbody>
        {filteredData.map(row => (
          <Tr key={row.id} borderBottom="1px solid" borderColor="gray.200">
            {headerKeys.map(h => (
              <Td key={h}>{row[h as keyof TableRow]}</Td>
            ))}

            {/* Columna de acciones con hover */}
            <Td>
              <Box
                position="relative"
                display="inline-block"
                _hover={{ ".actions": { opacity: 1, visibility: "visible" }, ".more": { opacity: 0 } }}
              >
                {/* Tres puntos iniciales */}
                <IconButton
                  className="more"
                  icon={<FiMoreHorizontal />}
                  aria-label="Más acciones"
                  size="sm"
                  variant="ghost"
                  transition="opacity 0.2s"
                />

                {/* Acciones que aparecen en hover */}
                <HStack
                  className="actions"
                  spacing={2}
                  position="absolute"
                  top="50%"
                  left="0"
                  transform="translateY(-50%)"
                  opacity={0}
                  visibility="hidden"
                  transition="opacity 0.2s"
                >
                  <IconButton
                    aria-label="Ver"
                    icon={<FiEye />}
                    size="sm"
                    variant="ghost"
                    onClick={() => console.log("Ver", row)}
                  />
                  <IconButton
                    aria-label="Editar"
                    icon={<FiEdit2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => console.log("Editar", row)}
                  />
                  <IconButton
                    aria-label="Borrar"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(row)}
                  />
                </HStack>
              </Box>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </Box>
    </Box>
  );
}
