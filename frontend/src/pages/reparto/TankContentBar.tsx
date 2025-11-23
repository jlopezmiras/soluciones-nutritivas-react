// components/TankContentBar.tsx

import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import { getFertilizerColor } from './fertilizerColors'; // Importa de tu archivo de utilidades

interface TankContentBarProps {
  fertilizers: FertilizerData[];
}

interface FertilizerData {
    name: string;
    quantity: number; // En litros
}

const TankContentBar: React.FC<TankContentBarProps> = ({ fertilizers }) => {

  const totalVolume = fertilizers.reduce((acumulador, fert) => {
  // 1. Acumulador: el total que llevamos sumado hasta ahora
  // 2. fertilizante: el objeto actual en el array
  return acumulador + fert.quantity;
  }, 0);
  
  // Ordenar los fertilizantes por cantidad para una visualización más limpia
  const sortedFertilizers = [...fertilizers].sort((a, b) => b.quantity - a.quantity);


  return (
    <Box
      p={1}
      w="250px" // Ancho fijo
      h="400px" // Alto fijo
      position="relative"
      display="flex"
      flexDirection="column-reverse" // Apila desde abajo hacia arriba
      overflow="hidden"
      bg="transparent"
    >
      {/* Segmentos de fertilizantes */}
      {sortedFertilizers.map((fert, index) => {
        const heightPercentage = (fert.quantity / totalVolume) * 100;

        
        if (fert.quantity > 0) {
          return (
            // <Tooltip
            //   key={fert.name}
            //   label={`${fert.name}: ${fert.quantity} L (${heightPercentage.toFixed(1)}%)`}
            //   aria-label={`${fert.name} quantity`}
            // >
              <Box
                bg={getFertilizerColor(fert.name)}
                height={`${heightPercentage}%`} // Altura proporcional
                width="100%"
                transition="height 0.3s ease-out"
                display="flex"
                borderTopRadius={index===sortedFertilizers.length-1 ? "3xl" : "0"}
                borderBottomRadius={index===0 ? "3xl" : "0"}
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="xs"
                fontWeight="semibold"
                textShadow="1px 1px 2px rgba(0,0,0,0.6)"
              >
                {/* Muestra un texto legible si el segmento es lo suficientemente grande */}
                <Text fontSize="md">{heightPercentage > 10 ? `${fert.name} (${Math.round(fert.quantity)})` : ''}</Text>
              </Box>
            // </Tooltip>
          );
        }
        return null;
      })}

    </Box>
  );
};

export default TankContentBar;