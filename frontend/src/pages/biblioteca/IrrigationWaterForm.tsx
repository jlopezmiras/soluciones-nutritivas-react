import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  VStack,
  Heading,
  Divider,
  useToast,
} from "@chakra-ui/react";
import api from "../../api";

interface AguaRiego {
  nombre: string;
  fecha: string;
  observaciones: string;
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
  conductividad: number;
}

interface Props { onBack: () => void; // callback para volver atrás 
    }

export default function IrrigationWaterForm({ onBack }: Props) {
  const [values, setValues] = useState<AguaRiego>({
    nombre: "",
    fecha: "",
    observaciones: "",
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
    conductividad: 0,
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AguaRiego
  ) => {
    const value =
      field === "nombre" || field === "fecha" || field === "observaciones"
        ? e.target.value
        : parseFloat(e.target.value) || 0;
    setValues({ ...values, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<AguaRiego>("/waters/", values);
      toast({
        title: "Agua de riego guardada",
        description: `Nombre: ${response.data.nombre}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setValues({
        nombre: "",
        fecha: "",
        observaciones: "",
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
        conductividad: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el agua de riego",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Función para renderizar cada sección
  const renderSection = (title: string, content: React.ReactNode) => (
    <SimpleGrid columns={2} columnGap="40px" alignItems="flex-start" w="full">
      <Box w="200px" display="flex" flexDirection="column" alignItems="flex-start">
        <Heading size="sm" mt={2}>
          {title}
        </Heading>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start" w="100%">{content}</Box>
    </SimpleGrid>
  );

  return (
    <Box p={6} maxW="1200px" mx="auto" ml={20}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">

          {/* Información General */}
          {renderSection(
            "Información General",
            <VStack spacing={4} align="stretch" w="100%">
              <SimpleGrid columns={[2, 2]} spacing={3}>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={values.nombre}
                    onChange={(e) => handleChange(e, "nombre")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    value={values.fecha}
                    onChange={(e) => handleChange(e, "fecha")}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Observaciones</FormLabel>
                <Textarea
                  value={values.observaciones}
                  onChange={(e) => handleChange(e, "observaciones")}
                />
              </FormControl>
            </VStack>
          )}

          <Divider />

          {/* Cationes */}
          {renderSection(
            "Cationes",
            <SimpleGrid columns={[2, 3, 4]} spacing={3}>
              {["calcio", "magnesio", "potasio", "sodio", "amonio"].map(
                (prop) => (
                  <FormControl key={prop}>
                    <FormLabel textTransform="capitalize">{prop}</FormLabel>
                    <Input
                      type="number"
                      value={values[prop as keyof AguaRiego]}
                      onChange={(e) =>
                        handleChange(e, prop as keyof AguaRiego)
                      }
                    />
                  </FormControl>
                )
              )}
            </SimpleGrid>
          )}

          <Divider />

          {/* Aniones */}
          {renderSection(
            "Aniones",
            <SimpleGrid columns={[2, 3, 4]} spacing={3} >
              {[
                "nitrato",
                "carbonato",
                "fosforo",
                "cloruro",
                "sulfato",
                "bicarbonato",
              ].map((prop) => (
                <FormControl key={prop}>
                  <FormLabel textTransform="capitalize">{prop}</FormLabel>
                  <Input
                    type="number"
                    value={values[prop as keyof AguaRiego]}
                    onChange={(e) =>
                      handleChange(e, prop as keyof AguaRiego)
                    }
                  />
                </FormControl>
              ))}
            </SimpleGrid>
          )}

          <Divider />

          {/* Otras propiedades */}
          {renderSection(
            "Otras propiedades",
            <SimpleGrid columns={[2, 2]} spacing={3}>
              <FormControl>
                <FormLabel>pH</FormLabel>
                <Input
                  type="number"
                  value={values.ph}
                  onChange={(e) => handleChange(e, "ph")}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Conductividad</FormLabel>
                <Input
                  type="number"
                  value={values.conductividad}
                  onChange={(e) => handleChange(e, "conductividad")}
                />
              </FormControl>
            </SimpleGrid>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            alignSelf="center"
          >
            Guardar Agua
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
