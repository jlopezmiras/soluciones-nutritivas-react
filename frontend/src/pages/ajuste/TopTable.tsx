import React, { use, useEffect, useState } from 'react';
import {
  Box,
  Text,
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
  Tfoot,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { FaArrowUp, FaArrowDown, FaCheck, FaChevronDown } from 'react-icons/fa';



const NUTRIENTS = ["no3", "h2po4", "so4", "k", "ca", "mg", "nh4", "cl", "na", "hco3"];

// Map nutrient strings to formatted JSX
const HEADERMAP: Record<string, React.ReactNode> = {
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


function formatStyledValue(value: any, format_zero : boolean = false) {
  if (Array.isArray(value) && value.length === 2) {
    const [intPartMin, decPartMin] = Number(value[0]).toFixed(1).split(".");
    const [intPartMax, decPartMax] = Number(value[1]).toFixed(1).split(".");
    if (Number(value[0])<=0) {
      return (
    <Text as="span" fontSize="md" fontFamily="mono" opacity={0.7}>
      {"<"} {intPartMax}
      <Text as="span" fontSize="sm" fontFamily="mono" opacity={0.9}>
        .{decPartMax}
      </Text>
    </Text>
  );
    }
    return (
    <Text as="span" fontSize="md" fontFamily="mono" opacity={0.7}>
      {"("}{intPartMin}
      <Text as="span" fontSize="sm" fontFamily="mono" opacity={0.9}>
        .{decPartMin}
      </Text>
      -{intPartMax}
      <Text as="span" fontSize="sm" fontFamily="mono" opacity={0.9}>
        .{decPartMax}
      </Text>
      {")"}
    </Text>
  );
  }

  const num = Number(value);
  if (isNaN(num)) return "";
  if (!format_zero && num === 0) return "";

  const [intPart, decPart] = num.toFixed(2).split(".");
  return (
    <Text as="span" fontSize="xl" fontFamily="mono">
      {intPart}
      <Text as="span" fontSize="sm" fontFamily="mono" opacity={0.9}>
        .{decPart}
      </Text>
    </Text>
  );
};



function InitialRow( 
  { fullData, columnKeys }: { fullData: Array<Record<string, string | number>>, columnKeys: string[] }) {

  columnKeys = columnKeys.filter(key => (key !== "qty"));

  const intakeData = fullData[2];
  const [moreDetail, setMoreDetail] = useState<boolean>(false);

  const handleMoreDetailClick = () => {
    setMoreDetail(prev => !prev); // toggle true/false
  };

  return (
    <Tbody>
      <Tr border="none">
        <Td
          textAlign="left"
          fontWeight="bold"
          fontSize={"lg"}
          colSpan={columnKeys.length} // spans entire row horizontally
          border="none"
          pt={2}
          pb={0}
        >
          <HStack spacing={3}>
            <Text>APORTES TOTALES</Text>
            <Tooltip label="Desglosar aportes" placement={"top"} hasArrow>
              <IconButton 
                aria-label="Desglosar aportes" 
                icon={<FaChevronDown/>} 
                size="sm" 
                variant="ghost"
                onClick={() => handleMoreDetailClick()} />
            </Tooltip>
          </HStack>
        </Td>
      </Tr>
      { moreDetail &&

        <React.Fragment>
        <Tr borderTop="0" borderBottom="1px solid" borderColor="gray.200">
          {columnKeys.map((key, i) => (
            <Td 
              key={i} 
              fontSize={"lg"}
              textAlign={i===0 ? "left" : "right"}
              width={i === 0 ? "50px" : i === 1 ? "30px" : "20px"} // first column wider
              colSpan={i === 0 ? 2 : 1}
              pb={3}
              pt={3}
            >
              {Array.isArray(fullData[0][key]) ? formatStyledValue(fullData[0][key]) :
            !isNaN(Number(fullData[0][key])) ? formatStyledValue(fullData[0][key]) : fullData[0][key]}
            </Td>
        ))}
        </Tr>
        <Tr borderTop="0" borderBottom="1px solid" borderColor="gray.200">
          {columnKeys.map((key, i) => (
            <Td 
              key={i} 
              fontSize={"lg"}
              textAlign={i===0 ? "left" : "right"}
              width={i === 0 ? "50px" : i === 1 ? "30px" : "20px"} // first column wider
              colSpan={i === 0 ? 2 : 1}
              pb={3}
              pt={3}
            >
              {Array.isArray(fullData[1][key]) ? formatStyledValue(fullData[1][key]) :
            !isNaN(Number(fullData[1][key])) ? formatStyledValue(fullData[1][key]) : fullData[1][key]}
            </Td>
        ))}
        </Tr>
        </React.Fragment>
      }

      <Tr borderTop="0" borderBottom="10px solid" borderColor="gray.200" pb={0}>
        {columnKeys.map((key, i) => (
          <Td 
            key={i} 
            fontSize={"lg"}
            textAlign={i===0 ? "left" : "right"}
            width={i === 0 ? "50px" : i === 1 ? "30px" : "20px"} // first column wider
            colSpan={i === 0 ? 2 : 1}
            pb={3}
            pt={3}
          >
            {Array.isArray(fullData[2][key]) ? formatStyledValue(fullData[2][key], true) :
            !isNaN(Number(fullData[2][key])) ? formatStyledValue(fullData[2][key], true) : fullData[2][key]}
          </Td>
      ))}
      </Tr>
    </Tbody>
  );
};



function SummaryRow(
  {row, diff_row, columnKeys}:
{ row: Record<string, string | number>, 
  diff_row: Record<string, string | number>, 
  columnKeys: string[] }) {

  const keys = columnKeys.filter(key => (key !== "name" && key !== "qty"));

  return (
    <Tfoot 
      zIndex={2} 
      position="sticky" 
      bottom={0}
      bg={"gray.100"}
      borderColor={"gray.300"}
      borderWidth={5}
      py={6} 
      textTransform="none"
      fontSize="md"
      color={useColorModeValue("light.text","dark.text")} >
      <Tr key={"realIntakes"}>
        <Td
          textAlign="left"
          fontWeight="bold"
          fontSize={"lg"}
          pb={2}
          colSpan={2}
        >
          APORTES REALES
        </Td>

        {keys.map((key) => {
          const value = row[key];
          // const arrow = Number(diff_row?.[key]) > 0 ? "↑" : Number(diff_row?.[key]) < 0 ? "↓" : "";
          // Choose icon based on trend
          let icon = FaCheck;
          let icon_color = "green.500";
          let diff_num = "";
          if (Number(Number(diff_row?.[key]).toFixed(2)) > 0){ icon = FaArrowUp; icon_color = "red.500"; diff_num=String(Number(diff_row?.[key]).toFixed(1))};
          if (Number(Number(diff_row?.[key]).toFixed(2)) < 0){ icon = FaArrowDown; icon_color = "red.500"; diff_num=String(Number(diff_row?.[key]).toFixed(1))};

          return (
          <Td 
            key={key} 
            fontSize={"lg"}
            textAlign={"right"}
          >
            <HStack spacing={0} justifyContent="flex-end">
                <Text opacity={diff_num==="" ? 0.7 : 1}>
                  {!isNaN(Number(value)) ? formatStyledValue(Number(value), true) : value}
                </Text>
                {icon && 
                <>
                  <Text as="sup" position={"relative"} top="-18px" fontFamily={"mono"} fontSize={"12px"}>
                    <Icon as={icon} boxSize={3.5} color={icon_color} p={0}/>
                  </Text>
                  <Text as="sup" position={"relative"} top="-18px" fontFamily={"mono"} fontSize={"12px"}>
                    {diff_num}
                  </Text>
                </>
                }
              </HStack>
          </Td>
          );
        }
        )}

      </Tr>
    </Tfoot>
  );
}


interface TopTableProps {
  data: Array<Record<string, any>>;
  typeNutrient: Record<string, string[]>;
}

export default function TopTable({ data, typeNutrient }: TopTableProps) {

  const headerKeys = [
    "name",
    "qty",
    "no3",
    "h2po4",
    "so4",
    "hco3",
    "cl",
    "na",
    "ca",
    "mg",
    "k",
    "nh4"
  ];

  // Filter by nutrients on target to minimize row tables
  const [filteredHeaderKeys, setFilteredHeaderKeys] = useState<string[]>(headerKeys);

  useEffect(() => {
    const filtered = headerKeys.filter(item => typeNutrient.target.includes(item));
    // setFilteredHeaderKeys(["name", "qty", ...filtered]); // Filtered table
    setFilteredHeaderKeys(headerKeys);
  }, [typeNutrient]);


  const HEADER_MAP: Record<string, React.ReactNode> = {
    name: "Sustancia",
    qty: "Cantidad",
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
    "Potasio",
    "Amonio"
];


  const headingColor = useColorModeValue("light.primary.main","dark.accent.main");
  // const bgTableColor = useColorModeValue("light.primary.50","dark.background.800");
  const tableHeaderColor = useColorModeValue("light.background.100","dark.background.800");

  //maxW={`${200 * filteredHeaderKeys.length}px`}
  return (
    <Box flex="1"> 
        <Table variant="simple" size="lg" whiteSpace="nowrap">
        <Thead zIndex={2} position="sticky" top={0} >
            <Tr>
            {filteredHeaderKeys.map((col, i) => (
                <Th 
                    key={col} 
                    position="sticky" 
                    top={0} 
                    zIndex={10} 
                    bg={tableHeaderColor}
                    py={6} 
                    textTransform="none"
                    fontSize="md"
                    textAlign={i===0 ? "left" : "right"}
                    color={useColorModeValue("light.text","dark.text")}
                    // width={i === 0 ? "50px" : i === 1 ? "50px" : "10px"} // first column wider
                    isTruncated
                >
                    {HEADER_MAP[col]}
                </Th>
                ))}
            </Tr>
        </Thead>
        {data && data.length > 0 && (
          <React.Fragment>

            {/* Row  for intakes (also details about water and target solution */}
            <InitialRow fullData={data.slice(0,3)} columnKeys={filteredHeaderKeys} />

            <Tbody overflowY="auto">
              <Tr border="none">
                  <Td
                    textAlign="left"
                    fontWeight="bold"
                    fontSize={"lg"}
                    colSpan={filteredHeaderKeys.length} // spans entire row horizontally
                    border="none"
                    pt={8}
                    pb={2}
                  >
                    FERTILIZANTES
                  </Td>
                </Tr>
                {data.slice(3,-2).map((row, index) => (
                <Tr borderTop="0" borderBottom="1px solid" borderColor="gray.200">
                {filteredHeaderKeys.map((key, i) => (
                    <Td 
                      key={i}
                      fontSize={"lg"}
                      textAlign={i===0 ? "left" : "right"}
                    >
                      {!isNaN(Number(row[key])) ? formatStyledValue(Number(row[key])) : row[key]}
                    </Td>
                ))}
                </Tr>
            ))}
            </Tbody>

            <SummaryRow row={data[data.length - 1]} diff_row={data[data.length - 2]} columnKeys={filteredHeaderKeys} />

          </React.Fragment>
        )}
        </Table>
    </Box>
  );
}
