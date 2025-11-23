import {
  Grid,
  GridItem,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  VStack,
  useToast,
  Heading,
  Divider,
  HStack,
  Flex,
  Box,
  Select,
  InputGroup,
  InputRightElement,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";

import api from "../../api";
import { useState } from "react";
import { form } from "framer-motion/client";
import SegmentedControl from "../../components/SegmentedControl";



const labels: Record<keyof Fertilizer, string> = {
  no3: "Nitrato",
  h2po4: "Fosfato",
  so4: "Sulfato",
  hydrogenion: "Hidrogeniones",
  cl: "Cloruro",
  k: "Potasio",
  ca: "Calcio",
  mg: "Magnesio",
  na: "Sodio",
  nh4: "Amonio",
  name: "Nombre",
  date: "Fecha",
  description: "Descripción",
  state: "Estado",
  density: "Densidad",
};

interface Fertilizer {
  name: string;
  date: string;
  description: string;
  state: "l" | "s";
  density?: number;
  no3: number;
  h2po4: number;
  so4: number;
  hydrogenion: number;
  cl: number;
  k: number;
  ca: number;
  mg: number;
  na: number;
  nh4: number;
}

interface Props {
  onBack: () => void; // callback para volver atrás
}


type PropQuimica = 
  | "no3"
  | "h2po4"
  | "so4"
  | "hydrogenion"
  | "cl"
  | "na"
  | "k"
  | "ca"
  | "mg"
  | "nh4";


export default function FertilizerForm({ onBack }: Props) {
  const [values, setValues] = useState<Fertilizer>({
    name: "",
    date: "",
    description: "",
    state: "s",
    density: 0,
    no3: 0,
    h2po4: 0,
    so4: 0,
    hydrogenion: 0,
    cl: 0,
    k: 0,
    ca: 0,
    mg: 0,
    na: 0,
    nh4: 0,
  });

  const [units, setUnits] = useState<Record<PropQuimica, string>>({
    no3: "mmol/L",
    h2po4: "mmol/L",
    so4: "mmol/L",
    hydrogenion: "mmol/L",
    cl: "mmol/L",
    na: "mmol/L",
    k: "mmol/L",
    ca: "mmol/L",
    mg: "mmol/L",
    nh4: "mmol/L",
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Fertilizer
  ) => {
    const value =
      field === "name" || field === "date" || field === "description"
        ? e.target.value
        : parseFloat(e.target.value) || 0;
    setValues({ ...values, [field]: value });
  };

  // Specific handler for the SegmentedControl in "state"
  const handleStateChange = (value: string) => {
    setValues({ ...values, state: value as "l" | "s" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...values,
      units,
    };

    console.log("Payload a enviar:", payload);

    try {
      await api.post<Fertilizer>("/library/fertilizers/", payload);
      
      // Mostrar toast
      toast({
        title: "Fertilizante guardado",
        description: `Nombre: ${values.name}`,
        status: "success",
        duration: 2500, // dura 1.5 segundos
        isClosable: true,
      });

      // Resetear formulario
      setValues({
        name: "",
        date: "",
        description: "",
        state: "s",
        density: 0,
        no3: 0,
        h2po4: 0,
        so4: 0,
        hydrogenion: 0,
        cl: 0,
        k: 0,
        ca: 0,
        mg: 0,
        na: 0,
        nh4: 0,
      });
      setUnits({
        no3: "mmol/L",
        h2po4: "mmol/L",
        so4: "mmol/L",
        hydrogenion: "mmol/L",
        cl: "mmol/L",
        na: "mmol/L",
        k: "mmol/L",
        ca: "mmol/L",
        mg: "mmol/L",
        nh4: "mmol/L",
      });

      // Llamar a onBack después de un pequeño delay
      setTimeout(() => {
        onBack();
      }, 10);

    } catch (error) {
      console.log("Error saving fertilizer:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el fertilizante",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const maxWNumericInputs = "180px";

  return (
    <form onSubmit={handleSubmit}>
       
    <Table 
      variant="ghost" 
      ml={10} 
      my={6}
    >
      <Tbody>

        {/* Información general */}
        <Tr>
          <Td width="220px" verticalAlign="top" pb={"50px"}>
            <Heading size="sm">Información general</Heading>
          </Td>

          <Td pb={"50px"}>
            <VStack spacing={4} align="stretch" maxW="1000px">

              <HStack spacing={4} align="flex-start">
                <FormControl flex={1}>
                  <FormLabel mb={0}>Nombre</FormLabel>
                  <Input
                    w="100%"
                    value={values.name}
                    onChange={(e) => handleChange(e, "name")}
                  />
                </FormControl>

                <FormControl w="200px">
                  <FormLabel mb={0}>Fecha</FormLabel>
                  <Input
                    type="date"
                    value={values.date}
                    onChange={(e) => handleChange(e, "date")}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel mb={0}>Descripción</FormLabel>
                <Input
                  type="text"
                  w="100%"
                  value={values.description}
                  onChange={(e) => handleChange(e, "description")}
                />
              </FormControl>

              <FormControl>
                <FormLabel mb={1}>Tipo de fertilizante</FormLabel>
                <SegmentedControl
                  options={[
                    { value: "pure", label: "Puro" },
                    { value: "compund", label: "Compuesto" },
                  ]}
                  name="fertType"
                  defaultValue="pure"
                  onChange={handleStateChange}
                />
              </FormControl>
            </VStack>
          </Td>
        </Tr>



        {/* Divider */}
        {/* <Tr>
          <Td colSpan={2}>
            <VStack spacing={1} my={4}>
              <Divider />
              <Divider />
            </VStack>
          </Td>
        </Tr> */}

      </Tbody>
      </Table>

      {/* Divider */}
      <VStack spacing={1} my={4} pl={10}>
        <Divider />
        <Divider />
      </VStack>


      <Table
        variant="simple" 
      ml={10} 
      mt={0}
      pt={0}
      sx={{
      // "tbody tr:nth-child(odd)": { backgroundColor: "gray.100" },  // start stripe with second row
      // "tbody tr:nth-child(even)": { backgroundColor: "white" }
      }}
      >
        <Tbody>

        {/* Cationes */}
        <Tr>
          <Td width="220px" verticalAlign="top" pt="24px" pb="32px" >
            <Heading size="sm">Cationes</Heading>
          </Td>

          <Td pt="24px" pb="32px">
            <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}> 
                {["ca", "k", "mg", "na", "nh4", "hydrogenion"].map( (prop) => ( 
                <FormControl key={prop}> 
                <FormLabel textTransform="capitalize" mb={1}> 
                    {labels[prop as keyof Fertilizer]} 
                </FormLabel> 
                <InputGroup> 
                <Input 
                  borderRadius={"lg"} 
                  maxW={maxWNumericInputs} 
                  pr="80px" 
                  step="any" 
                  type="number" 
                  placeholder="0.00" 
                  onChange={(e) => handleChange(e, prop as keyof Fertilizer)} /> 
                <InputRightElement width="100px"> 
                <Select 
                  value={units[prop as PropQuimica]} 
                  onChange={(e) => setUnits({ ...units, [prop as PropQuimica]: e.target.value })} 
                  size="sm" 
                  border="none" 
                  bg="transparent" 
                  p={0} 
                  textAlign={"right"} 
                > 
                  <option value="mmol/L">mmol/L</option> 
                  <option value="mg/L">mg/L</option> 
                  <option value="meq/L">meq/L</option> 
                </Select> 
                </InputRightElement> 
                </InputGroup> 
                </FormControl> 
              ) )} 
                </SimpleGrid>
          </Td>
        </Tr>

        {/* Divider */}
        {/* <Tr>
          <Td colSpan={2}>
            <Divider my={4} />
          </Td>
        </Tr> */}

        {/* Aniones */}
        <Tr>
          <Td width="220px" verticalAlign="top" py="32px">
            <Heading size="sm">Aniones</Heading>
          </Td>

          <Td py="32px">
            <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}> 
                {["no3", "h2po4", "so4", "cl"].map( (prop) => ( 
                <FormControl key={prop}> 
                <FormLabel textTransform="capitalize" mb={1}> 
                    {labels[prop as keyof Fertilizer]} 
                </FormLabel> 
                <InputGroup> 
                <Input 
                  borderRadius={"lg"} 
                  maxW={maxWNumericInputs} 
                  pr="80px" 
                  step="any" 
                  type="number" 
                  placeholder="0.00" 
                  onChange={(e) => handleChange(e, prop as keyof Fertilizer)} /> 
                <InputRightElement width="100px"> 
                <Select 
                  value={units[prop as PropQuimica]} 
                  onChange={(e) => setUnits({ ...units, [prop as PropQuimica]: e.target.value })} 
                  size="sm" 
                  border="none" 
                  bg="transparent" 
                  p={0} 
                  textAlign={"right"} 
                > 
                  <option value="mmol/L">mmol/L</option> 
                  <option value="mg/L">mg/L</option> 
                  <option value="meq/L">meq/L</option> 
                </Select> 
                </InputRightElement> 
                </InputGroup> 
                </FormControl> 
              ) )} 
                </SimpleGrid>
          </Td>
        </Tr>

        {/* Divider */}
        {/* <Tr>
          <Td colSpan={2}>
            <Divider my={4} />
          </Td>
        </Tr> */}

        {/* Otras propiedades */}
        <Tr>
          <Td width="220px" verticalAlign="top" py="32px">
            <Heading size="sm">Otras propiedades</Heading>
          </Td>

          <Td py="32px">
            <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}>
              <FormControl>
                <FormLabel mb={1}>Estado</FormLabel>
                <SegmentedControl
                  options={[
                    { value: "l", label: "Líquido" },
                    { value: "s", label: "Sólido" },
                  ]}
                  name="state"
                  defaultValue="s"
                  onChange={handleStateChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel mb={1}>Densidad</FormLabel>
                <Input
                  maxW={maxWNumericInputs}
                  type="number"
                  step="any"
                  placeholder="0.00"
                  onChange={(e) => handleChange(e, "density")}
                />
              </FormControl>
            </SimpleGrid>
          </Td>
        </Tr>

      </Tbody>
    </Table>
    </form>
  );
}
