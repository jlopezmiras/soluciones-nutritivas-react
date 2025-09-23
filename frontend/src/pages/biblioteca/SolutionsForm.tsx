import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import api from "../../api"; // tu axios.create

interface AguaRiego {
  nombre: string;
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
}

export default function SolutionsForm() {
  const [values, setValues] = useState<AguaRiego>({
    nombre: "",
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
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AguaRiego
  ) => {
    const value = field === "nombre" ? e.target.value : parseFloat(e.target.value);
    setValues({ ...values, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Llamada POST a la API para guardar el agua de riego
      const response = await api.post<AguaRiego>("/waters/", values);

      toast({
        title: "Agua de riego guardada",
        description: `Nombre: ${response.data.nombre}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reiniciar formulario
      setValues({
        nombre: "",
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
      });
    } catch (error) {
      console.error("Error guardando agua de riego:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el agua de riego",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="2xl" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6} textAlign="center">
        Agregar Agua de Riego
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={values.nombre}
              onChange={(e) => handleChange(e, "nombre")}
            />
          </FormControl>

          <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
            <Heading size="sm" mb={3}>
              Propiedades Químicas
            </Heading>
            <SimpleGrid columns={[2, 3]} spacing={3}>
              {(
                ["nitrato","carbonato","magnesio","fosforo","cloruro","potasio","sulfato","sodio","amonio","bicarbonato","calcio"] as (keyof Omit<AguaRiego,"nombre">)[]
              ).map((prop) => (
                <FormControl key={prop}>
                  <FormLabel>{prop.charAt(0).toUpperCase() + prop.slice(1)}</FormLabel>
                  <Input
                    type="number"
                    value={values[prop]}
                    onChange={(e) => handleChange(e, prop)}
                  />
                </FormControl>
              ))}
            </SimpleGrid>
          </Box>

          <Button type="submit" colorScheme="blue">
            Guardar Agua
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
