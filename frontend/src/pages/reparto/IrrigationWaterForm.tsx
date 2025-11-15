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



const labels: Record<keyof AguaRiego, string> = {
  no3: "Nitrato",
  h2po4: "Fosfato",
  so4: "Sulfato",
  hco3: "Bicarbonato",
  co3: "Carbonato",
  cl: "Cloruro",
  k: "Potasio",
  ca: "Calcio",
  mg: "Magnesio",
  na: "Sodio",
  nh4: "Amonio",
  ph: "pH",
  conductivity: "Conductividad",
  name: "Nombre",
  date: "Fecha",
  description: "Descripción",
};

interface AguaRiego {
  name: string;
  date: string;
  description: string;
  no3: number;
  h2po4: number;
  so4: number;
  hco3: number;
  co3: number;
  cl: number;
  k: number;
  ca: number;
  mg: number;
  na: number;
  nh4: number;
  ph: number;
  conductivity: number;
}

interface Props {
  onSubmit: (data: Record<string, number>) => void;
  onBack?: () => void; // callback para volver atrás
}


type PropQuimica = 
  | "no3"
  | "h2po4"
  | "so4"
  | "hco3"
  | "co3"
  | "cl"
  | "na"
  | "k"
  | "ca"
  | "mg"
  | "nh4";


export default function IrrigationWaterForm({ onSubmit, onBack }: Props) {
  const [values, setValues] = useState<AguaRiego>({
    name: "",
    date: "",
    description: "",
    no3: 0,
    h2po4: 0,
    so4: 0,
    hco3: 0,
    co3: 0,
    cl: 0,
    k: 0,
    ca: 0,
    mg: 0,
    na: 0,
    nh4: 0,
    ph: 0,
    conductivity: 0,
  });

  const [units, setUnits] = useState<Record<PropQuimica, string>>({
    no3: "mmol/L",
    h2po4: "mmol/L",
    so4: "mmol/L",
    hco3: "mmol/L",
    co3: "mmol/L",
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
            {["ca", "k", "mg", "na", "nh4"].map(
              (prop) => (
                <FormControl key={prop}>
                  <FormLabel textTransform="capitalize" mb={1}>
                    {labels[prop as keyof AguaRiego]}
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
              "no3",
              "h2po4",
              "so4",
              "hco3",
              "co3",
              "cl",
            ].map((prop) => (
              <FormControl key={prop}>
                <FormLabel textTransform="capitalize" mb={1}>{labels[prop as keyof AguaRiego]}</FormLabel>
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
