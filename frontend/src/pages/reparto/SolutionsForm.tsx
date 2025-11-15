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
} from "@chakra-ui/react";

import api from "../../api";
import { useState } from "react";
import { form } from "framer-motion/client";

interface AguaRiego {
  name: string;
  date: string;
  description: string;
  nitrato: number;
  carbonato: number;
  magnesio: number;
  fosforo: number;
  cloruro: number;
  potasio: number;
  sulfato: number;
  sodio: number;
  amonio: number;
  bicarbonato: number;
  calcio: number;
  ph: number;
  conductivity: number;
}

interface Props {
  onSubmit: (data: Record<string, number>) => void;
  onBack?: () => void; 
}


type PropQuimica = 
  | "nitrato"
  | "carbonato"
  | "fosforo"
  | "cloruro"
  | "potasio"
  | "sodio"
  | "amonio"
  | "bicarbonato"
  | "calcio"
  | "magnesio"
  | "sulfato"


export default function SolutionsForm({ onSubmit, onBack }: Props) {
  const [values, setValues] = useState<AguaRiego>({
    name: "",
    date: "",
    description: "",
    nitrato: 0,
    carbonato: 0,
    magnesio: 0,
    fosforo: 0,
    cloruro: 0,
    potasio: 0,
    sulfato: 0,
    sodio: 0,
    amonio: 0,
    bicarbonato: 0,
    calcio: 0,
    ph: 0,
    conductivity: 0,
  });

  const [units, setUnits] = useState<Record<PropQuimica, string>>({
    nitrato: "mmol/L",
    carbonato: "mmol/L",
    fosforo: "mmol/L",
    cloruro: "mmol/L",
    potasio: "mmol/L",
    sodio: "mmol/L",
    amonio: "mmol/L",
    bicarbonato: "mmol/L",
    calcio: "mmol/L",
    magnesio: "mmol/L",
    sulfato: "mmol/L",
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AguaRiego
  ) => {
    const value =
      field === "name" || field === "date" || field === "description"
        ? e.target.value
        : parseFloat(e.target.value) || 0;
    setValues({ ...values, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValues = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
    );
    console.log("Submitting values:", numericValues);
    onSubmit(numericValues);
  };


  const maxWNumericInputs = "180px";

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        templateColumns="max-content 1fr"
        gap={4}
        columnGap={82}
        rowGap={8}
        m={6}
        ml={20}
      >
        <GridItem>
          <Heading size="sm">{"Información general"}</Heading>
        </GridItem>
        <GridItem>
          <VStack spacing={4} align="stretch" w="100%">
            {/* Fila horizontal: Nombre + Fecha */}
            <HStack spacing={4} align="flex-start">
              <FormControl flex={1}>
                <FormLabel mb={0}>Nombre</FormLabel>
                <Input
                  w="100%"       // se estira ocupando todo el espacio disponible
                  value={values.name}
                  onChange={(e) => handleChange(e, "name")}
                />
              </FormControl>

              <FormControl w="200px">  {/* ancho fijo para Fecha */}
                <FormLabel mb={0}>Fecha</FormLabel>
                <Input
                  type="date"
                  value={values.date}
                  onChange={(e) => handleChange(e, "date")}
                />
              </FormControl>
            </HStack>

            {/* Observaciones debajo */}
            <FormControl>
              <FormLabel mb={0}>Descripción</FormLabel>
              <Input
                type="text"
                w="100%"         // ocupa todo el ancho
                value={values.description}
                onChange={(e) => handleChange(e, "description")}
              />
            </FormControl>
          </VStack>
        </GridItem>

        <GridItem gridColumn="1 / -1">
            <VStack spacing={1} my={4}>
            <Divider />
            <Divider />
          </VStack>
        </GridItem>

        <GridItem>
          <Heading size="sm">{"Cationes"}</Heading>
        </GridItem>
        <GridItem>
          <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}>
            {["calcio", "magnesio", "potasio", "sodio", "amonio"].map(
              (prop) => (
                <FormControl key={prop}>
                  <FormLabel textTransform="capitalize" mb={1}>
                    {prop}
                  </FormLabel>
                    <InputGroup>
                      <Input
                        borderRadius={"lg"}
                        maxW={maxWNumericInputs}
                        pr="80px"
                        step="any"
                        type="number"
                        placeholder="0.00"
                        onChange={(e) => handleChange(e, prop as keyof AguaRiego)}
                      />
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
              )
            )}
          </SimpleGrid>
        </GridItem>

        <GridItem gridColumn="1 / -1">
          <Divider />
        </GridItem>

        <GridItem>
          <Heading size="sm">{"Aniones"}</Heading>
        </GridItem>
        <GridItem>
          <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}>
            {[
              "nitrato",
              "carbonato",
              "fosforo",
              "cloruro",
              "sulfato",
              "bicarbonato",
            ].map((prop) => (
              <FormControl key={prop}>
                <FormLabel textTransform="capitalize" mb={1}>{prop}</FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      step={"any"}
                      placeholder="0.00"
                      onChange={(e) => handleChange(e, prop as keyof AguaRiego)}
                    />
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
            ))}
          </SimpleGrid>
        </GridItem>

        <GridItem gridColumn="1 / -1">
          <Divider />
        </GridItem>

        <GridItem>
          <Heading size="sm">{"Otras propiedades"}</Heading>
        </GridItem>
        <GridItem>
          <SimpleGrid columns={{ base: 1, sm: 4, md: 5, lg: 6 }} spacing={6}>
            <FormControl>
              <FormLabel mb={1}>pH</FormLabel>
              <Input maxW={maxWNumericInputs}
                type="number"
                step="any"
                placeholder="0.00"
                onChange={(e) => handleChange(e, "ph")}
              />
            </FormControl>
            <FormControl>
              <FormLabel mb={1}>Conductividad</FormLabel>
              <Input maxW={maxWNumericInputs}
                type="number"
                step="any"
                placeholder="0.00"
                onChange={(e) => handleChange(e, "conductivity")}
              />
            </FormControl>
          </SimpleGrid>
        </GridItem>

        {/* Botones abajo a la derecha */}
        <GridItem gridColumn="1 / -1">
          <Flex justify="flex-end" gap={3} mt={4}>
            <Button variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="green">
              Guardar
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </form>
  );
}
