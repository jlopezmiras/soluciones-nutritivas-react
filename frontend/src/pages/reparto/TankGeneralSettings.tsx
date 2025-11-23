import React, { useEffect, useState } from 'react';
import {
  Flex,
  IconButton,
  VStack,
  useColorModeValue,
  Text,
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Collapse,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import api from '../../api';



const MotionFlex = motion(Flex);

export default function TankGeneralSettings() {
  const [navSize, setNavSize] = useState<'large'|'small'>('large');

  const toggleNavSize = () => {
    setNavSize((prev) => (prev === 'small' ? 'large' : 'small'));
  };

  const bgColor = useColorModeValue("light.background.100", 'dark.background.900');

  return (
    <MotionFlex
      pos="sticky"
      left={5}
      h="80vh"
      mt="0vh"
    //   boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius="lg"
      flexDir="column"
      justifyContent="space-between"
      p={4}
      bg={bgColor}
      animate={{ width: navSize === 'small' ? 75 : 300 }}
      initial={false}
      transition={{ duration: 0.4, type: 'spring', stiffness: 70, damping: 12 }}
    >
      <VStack as="nav" spacing={3} align="flex-start">
        <IconButton
          aria-label="Toggle sidebar"
          bg="none"
          _hover={{ bg: 'none' }}
          icon={<FiSettings size="24px"/>}
          alignSelf="flex-start"
          onClick={toggleNavSize}
        />

        {navSize === 'large' && <SettingsForm />}
      </VStack>
    </MotionFlex>
  );
}



const SettingsForm: React.FC = () => {
  const [superficie, setSuperficie] = useState<string>(() => localStorage.getItem("superficie") || "");
  const [emisores, setEmisores] = useState<string>(() => localStorage.getItem("emisores") || "");
  const [caudalEmisor, setCaudalEmisor] = useState<string>(() => localStorage.getItem("caudalEmisor") || "");
  const [tiempoRiego, setTiempoRiego] = useState<string>(() => localStorage.getItem("tiempoRiego") || "");

  const [caudalTotal, setCaudalTotal] = useState<number>(0);

  // 🔹 Guardar cambios automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("superficie", superficie);
  }, [superficie]);

  useEffect(() => {
    localStorage.setItem("emisores", emisores);
  }, [emisores]);

  useEffect(() => {
    localStorage.setItem("caudalEmisor", caudalEmisor);
  }, [caudalEmisor]);

  useEffect(() => {
    localStorage.setItem("tiempoRiego", tiempoRiego);
  }, [tiempoRiego]);


  const set_total_flow = async (flow: number) => {
    try {
        await api.post('/reparto/total-flow', { flow });
    }
    catch (error) {
        console.error("Error setting total flow:", error);
    }
  };

  useEffect(() => {
    set_total_flow(caudalTotal);
  });


  // 🔹 Calcular caudal total
  useEffect(() => {
    const total =
      Number(superficie) *
      Number(emisores) *
      Number(caudalEmisor) *
      Number(tiempoRiego) /
      60;

    setCaudalTotal(total || 0);
  }, [superficie, emisores, caudalEmisor, tiempoRiego]);

  return (
    <Box p={6} pt={0} maxW="400px">
      <Heading size="md" mb={4} color="teal.600">
        Datos generales
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel mb={1}>Superficie (m²)</FormLabel>
          <Input
            type="number"
            value={superficie}
            onChange={(e) => setSuperficie(e.target.value)}
            placeholder="Ej: 1000"
            borderColor="gray.500"
            bg="white"
          />
        </FormControl>

        <NumeroEmisoresField emisores={emisores} setEmisores={setEmisores} />

        <FormControl>
          <FormLabel mb={1}>Caudal emisores (L/h)</FormLabel>
          <Input
            type="number"
            value={caudalEmisor}
            onChange={(e) => setCaudalEmisor(e.target.value)}
            placeholder="Ej: 3"
            borderColor="gray.500"
            bg="white"
          />
        </FormControl>

        <FormControl>
          <FormLabel mb={1}>Tiempo riego (min)</FormLabel>
          <Input
            type="number"
            value={tiempoRiego}
            onChange={(e) => setTiempoRiego(e.target.value)}
            placeholder="Ej: 60"
            borderColor="gray.500"
            bg="white"
          />
        </FormControl>

        <Box mt={6} borderRadius="md">
          <Text fontWeight="bold" color="teal.700" fontSize="18px">
            Volumen total: {caudalTotal.toFixed(1)} litros
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};



interface NumeroEmisoresFieldProps {
    emisores: string;
    setEmisores: (value: string) => void;
}

const NumeroEmisoresField: React.FC<NumeroEmisoresFieldProps> = ({ emisores, setEmisores }) => {
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [distGoteros, setDistGoteros] = useState<string>(() => localStorage.getItem("distGoteros") || "");
  const [distPorta, setDistPorta] = useState<string>(() => localStorage.getItem("distPorta") || "");


  useEffect(() => {
    localStorage.setItem("distGoteros", distGoteros);
    }, [distGoteros]);

    useEffect(() => {
    localStorage.setItem("distPorta", distPorta);
    }, [distPorta]);


  // Calcular emisores si los campos extra están activos
  useEffect(() => {
    const emisoresCalculados = distGoteros && distPorta
      ? Math.floor(1 / (Number(distGoteros) * Number(distPorta)))
      : emisores;
    setEmisores(emisoresCalculados.toString());
  }, [distGoteros, distPorta]);
//   const emisoresCalculados =
//     showExtraFields && distGoteros && distPorta
//       ? Math.floor(1 / (Number(distGoteros) * Number(distPorta)))
//       : emisores;

  return (
    <Box w="100%">
      <FormControl mb={2}>
        <FormLabel mb={1} display="flex" alignItems="center">
          Número de emisores
          <IconButton
            aria-label="Mostrar opciones"
            icon={showExtraFields ? <FaChevronUp /> : <FaChevronDown />}
            size="sm"
            ml={"auto"}
            bg="transparent"
            onClick={() => setShowExtraFields(!showExtraFields)}
          />
        </FormLabel>
        <Input
          type="number"
          value={emisores}
          onChange={(e) => setEmisores(e.target.value)}
          placeholder="Ej: 2"
          borderColor={"gray.500"}
          bg="white"
          isDisabled={showExtraFields} // 🔑 deshabilitar si calculamos
        />
      </FormControl>

      <Collapse in={showExtraFields} animateOpacity>
        <VStack spacing={3} align="stretch" pl={4} mb={4}>
          <FormControl>
            <FormLabel mb={1}>Distancia entre goteros (m)</FormLabel>
            <Input
              type="number"
              value={distGoteros}
              onChange={(e) => setDistGoteros(e.target.value)}
              placeholder="Ej: 0.5"
              borderColor={"gray.500"}
                bg="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel mb={1}>Distancia entre portagoteros (m)</FormLabel>
            <Input
              type="number"
              value={distPorta}
              onChange={(e) => setDistPorta(e.target.value)}
              placeholder="Ej: 1.0"
              borderColor={"gray.500"}
                bg="white"
            />
          </FormControl>
        </VStack>
      </Collapse>
    </Box>
  );
};
