import { 
  Box, 
  useRadio, 
  HStack, 
  useRadioGroup 
} from '@chakra-ui/react';
import type { UseRadioProps, RadioGroupProps } from '@chakra-ui/react';
import React from 'react';

// Interfaz para los props de cada botón (segmento)
interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
}

const RadioCard: React.FC<RadioCardProps> = (props) => {
  // Hook de Chakra para gestionar el estado del radio (seleccionado/no seleccionado)
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label'>
      {/* Input oculto (radio button) */}
      <input {...input} />
      
      {/* El Box actúa como el botón visible (el segmento) */}
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='sm'
        
        // Estilos para el estado NO seleccionado
        bg='gray.50'
        color='gray.600'
        _hover={{ bg: 'gray.100' }}
        
        // Estilos para el estado SELECCIONADO (el segmento activo)
        _checked={{
          bg: 'blue.500', 
          color: 'white',
          borderColor: 'blue.500',
        }}
        // Estilos para el foco
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};


export default RadioCard;