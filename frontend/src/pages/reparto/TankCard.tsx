// components/TankCard.tsx

import React from 'react';
import {
  Box, Heading, Text, VStack, HStack, Divider, Icon, CircularProgress,
  CircularProgressLabel, IconButton, Tooltip,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
} from '@chakra-ui/react';
import { FaDrum, FaInfoCircle } from 'react-icons/fa';
import TankContentBar from './TankContentBar';
import { FaOilCan } from 'react-icons/fa6';
import { GiBarrel, GiOilDrum } from 'react-icons/gi';

// Tipos de datos
interface TankData {
  id: number;
  name: string;
  volume: number; // Volumen total del tanque en litros
  flow: number; // flow en L/H
  injection: number; // % de inyección
  fertilizers: { [key: string]: number }; // Nombre: Cantidad (Litros)
}

interface TankCardProps {
  tank: TankData;
  deleteTank: (tankId: number) => void;
  onViewDetails: (tankId: number) => void;
}

const TankCard: React.FC<TankCardProps> = ({ tank, deleteTank, onViewDetails }) => {


    // Define las dimensiones base para la visualización
    const tankWidth = "260px";
    const tankHeight = "420px";

    const cardWidth = "450px"
  
  // Convertir el objeto de fertilizantes a la lista de interfaz que necesita TankContentBar
  const fertilizerList = Object.entries(tank.fertilizers).map(([name, quantity]) => ({
    name,
    quantity,
  }));

  console.log('Rendering TankCard for tank:', tank);

  // Lógica para que el progreso sea gris si la inyección es 0
  const progressColor = Math.round(tank.injection) > 0 ? 'green.400' : 'gray.300';
  
  return (
    <Card
      key={tank.id}
      flex="0 0 auto"
      role="group"
      bg="white"
    //   height="calc((100vh - 250px) / 3)"
      borderRadius="lg"
      borderColor="gray.200"
      borderWidth={2}
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
      overflow="hidden"
      shadow="lg"
    //   w="450px" 
      px={4}
      py={0}
      
      // Hacemos toda la card clicable para la interacción principal
      onClick={() => onViewDetails(tank.id)} 
    >
        <CardHeader
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.2s"
            p={2}
            // pb={0}
          >
            <CloseButton ml="auto" onClick={() => deleteTank(tank.id)}/>
        </CardHeader>
        <CardBody p={6} pt={0}>
        <VStack align="stretch" spacing={4}>
            
            {/* Cabecera del Tanque */}
            <HStack justifyContent="space-between" alignItems="center" mb={0}>
            <Heading size="md" color="teal.700" display="flex" alignItems="center">
                <Icon as={GiBarrel} w={7} h={7} mr={2} color="teal.500" />
                {tank.name}
            </Heading>
            <Text fontSize="md" color="gray.500" fontWeight="semibold">{tank.volume} L</Text>
            </HStack>
            
            <Divider borderWidth="1px" borderColor={"gray.600"}/>

            {/* Visualización del Contenido del Tanque */}
            <Box 
                position="relative" 
                display="flex" 
                flexDirection="column" 
                alignItems="center"
                w={tankWidth}
            >
                {/* 1. Tapa / Cuello del Tanque */}
                <Box
                    w="100px" 
                    h="20px" 
                    bg="gray.300" // Color de la tapa
                    borderTopRadius="lg"
                    borderX="2px"
                    borderY="2px"
                    borderColor="gray.400"
                    mb="-2px" // Solapar ligeramente con el cuerpo
                    zIndex={3}
                />
                <Box
                    w="60px" 
                    h="12px" 
                    bg="gray.300" // Color de la tapa
                    borderX="2px"
                    borderColor="gray.400"
                    mb="-2px" // Solapar ligeramente con el cuerpo
                    zIndex={2}
                />
                {/* 2. Cuerpo del Tanque (Contiene la Barra de Colores) */}
                <Box
                    w={tankWidth}
                    h={tankHeight}
                    border="2px solid"
                    borderColor="teal.400" // Borde temático
                    borderRadius="3xl" // Redondeado general
                    overflow="hidden"
                    p={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="stretch"
                    bg="white"
                    zIndex={1}
                >
                    <HStack justifyContent="center" bg="transparent">
                    <TankContentBar fertilizers={fertilizerList} />
                    </HStack>
                </Box>
            </Box>

            <Divider />

            {/* Resumen de Operación (flow e Inyección) */}
            <HStack justifyContent="space-between" alignItems="center" pt={1}>
            <Tooltip label={`Caudal de ${tank.flow.toFixed(1)} L/H`}>
                <Text fontSize="md" color="gray.700">
                    <Text as="span" fontWeight="bold" color="teal.600">{tank.flow.toFixed(1)} L/H</Text>
                </Text>
            </Tooltip>
            
            <HStack alignItems="center">
                <Tooltip label={`Inyección al ${Math.round(tank.injection)}%`}>
                    <CircularProgress 
                    value={Math.round(tank.injection)} 
                    color={progressColor} 
                    size="60px" 
                    thickness='8px'
                    >
                    <CircularProgressLabel fontSize="md" fontWeight="bold">
                        {Math.round(tank.injection)}%
                    </CircularProgressLabel>
                    </CircularProgress>
                </Tooltip>
                
                </HStack>
            </HStack>
        </VStack>
        </CardBody>
    </Card>
  );
};

export default TankCard;