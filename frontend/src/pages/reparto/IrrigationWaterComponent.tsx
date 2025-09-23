import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import api from "../../api"; // tu axios.create

type IrrigationWater = {
  id: number;
  name: string;
  nitrato: number;
  fosforo: number;
  sulfato: number;
  bicarbonato: number;
  carbonato: number;
  cloruro: number;
  sodio: number;
  calcio: number;
  magnesio: number;
  potasio: number;
  amonio: number;
  ph: number;
  conductivity: number;
};

type IrrigationWaterForm = Omit<IrrigationWater, "id">;

const IrrigationWaterComponent: React.FC = () => {
  const [waters, setWaters] = useState<IrrigationWater[]>([]);
  const [form, setForm] = useState<IrrigationWaterForm>({
    name: "",
    nitrato: 0,
    fosforo: 0,
    sulfato: 0,
    bicarbonato: 0,
    carbonato: 0,
    cloruro: 0,
    sodio: 0,
    calcio: 0,
    magnesio: 0,
    potasio: 0,
    amonio: 0,
    ph: 0,
    conductivity: 0,
  });

  const handleChange = (field: keyof IrrigationWaterForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchWaters = async () => {
    try {
      const response = await api.get<IrrigationWater[]>("/waters/");
      setWaters(response.data);
    } catch (error) {
      console.error("Error fetching waters:", error);
    }
  };

  const createWater = async () => {
    try {
      const response = await api.post<IrrigationWater>("/waters/", form);
      setWaters((prev) => [...prev, response.data]);
      setForm({
        name: "",
        nitrato: 0,
        fosforo: 0,
        sulfato: 0,
        bicarbonato: 0,
        carbonato: 0,
        cloruro: 0,
        sodio: 0,
        calcio: 0,
        magnesio: 0,
        potasio: 0,
        amonio: 0,
        ph: 0,
        conductivity: 0,
      });
    } catch (error) {
      console.error("Error creando agua de riego:", error);
      alert("Error creando agua de riego");
    }
  };

  useEffect(() => {
    fetchWaters();
  }, []);

  return (
    <Box p={4} maxW="600px" mx="auto">
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Nombre</FormLabel>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Agua 1"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Nitrato</FormLabel>
          <Input
            type="number"
            value={form.nitrato}
            onChange={(e) => handleChange("nitrato", parseFloat(e.target.value))}
          />
        </FormControl>
        {/* Puedes agregar más campos siguiendo el mismo patrón */}
        <Button colorScheme="teal" onClick={createWater}>
          Guardar Agua de Riego
        </Button>
      </VStack>

      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Lista de Aguas de Riego
        </Text>
        {waters.map((w) => (
          <HStack key={w.id} spacing={4} mb={1}>
            <Text>{w.name}</Text>
            <Text>Nitrato: {w.nitrato}</Text>
          </HStack>
        ))}
      </Box>
    </Box>
  );
};

export default IrrigationWaterComponent;
