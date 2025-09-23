import React, { use, useState } from 'react';
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
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';

interface TopTableProps {
  data: Array<Record<string, any>>;
}

export default function TopTable({ data }: TopTableProps) {

  const headerKeys = [
    "Sustancia",
    "Cantidad",
    "Nitrato",
    "Fósforo",
    "Sulfato",
    "Bicarbonato",
    "Cloruro",
    "Sodio",
    "Calcio",
    "Magnesio",
    "Potasio"
]

  const headerAbbreviations = [
    "Sustancia",
    "Cantidad",
    "Nitrato",
    "Fósforo",
    "Sulfato",
    "Bicarbonato",
    "Cloruro",
    "Sodio",
    "Calcio",
    "Magnesio",
    "Potasio"
];


  const headingColor = useColorModeValue("light.primary.main","dark.accent.main");
  // const bgTableColor = useColorModeValue("light.primary.50","dark.background.800");
  const tableHeaderColor = useColorModeValue("light.background.100","dark.background.800");

  return (
    <Box flex="1" overflowY="auto">
        <Table variant="simple" size="lg">
        <Thead zIndex={2} position="sticky" top={0}>
            <Tr>
            {headerAbbreviations.map((col, i) => (
                <Th 
                    key={col} 
                    position="sticky" 
                    top={0} 
                    zIndex={10} 
                    bg={tableHeaderColor}
                    py={6} 
                    textTransform="none"
                    fontSize="md"
                    color={useColorModeValue("light.text","dark.text")}
                    >
                    {col}
                </Th>
                ))}
            </Tr>
        </Thead>
        <Tbody>
            {data.map((row, index) => (
            <Tr key={index} borderBottom="1px solid" borderColor="gray.200">
            {headerKeys.map((key, i) => (
                <Td key={i}>{row[key]}</Td>
            ))}
            </Tr>
        ))}
        </Tbody>
        </Table>
    </Box>
  );
}
