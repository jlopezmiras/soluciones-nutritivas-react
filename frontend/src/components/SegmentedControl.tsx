import { type RadioGroupProps, useRadioGroup, HStack } from "@chakra-ui/react";
import { useState } from "react";
import RadioCard from "./RadioCard";

// Array de datos de ejemplo
const viewOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'completed', label: 'Completados' },
];

// Interfaz para los props del grupo, basada en RadioGroupProps
interface SegmentedControlProps extends Omit<RadioGroupProps, 'children'> {
  options: { value: string; label: string }[];
}


const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, name, defaultValue, value, onChange, ...rest }) => {
  
  // Hook de Chakra para crear un RadioGroup
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value,
    onChange,
  });

  // Los props para el contenedor del grupo
  const group = getRootProps();

  return (
    // Se usa HStack o Flex para la disposición horizontal
    <HStack {...group} {...rest}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return (
          <RadioCard key={option.value} {...radio}>
            {option.label}
          </RadioCard>
        );
      })}
    </HStack>
  );
};


export default SegmentedControl;