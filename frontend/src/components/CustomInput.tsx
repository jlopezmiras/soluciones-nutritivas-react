import { useState } from 'react';
import { Input } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';

const CustomInput = ({ placeholder = "0.00", ...rest }: InputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleFocus = () => {
    // Cuando el input recibe el foco, borramos el valor del estado.
    // Esto hace que el placeholder desaparezca.
    setInputValue('');
  };

  const handleBlur = () => {
    // Opcional: Si el input queda vacío al perder el foco,
    // puedes resetear el valor, aunque el placeholder
    // se mostrará automáticamente si el valor es una cadena vacía.
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Actualizamos el estado con cada cambio del usuario.
    setInputValue(e.target.value);
  };

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default CustomInput;