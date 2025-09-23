import React, { useState } from "react";
import { Input, FormControl, FormLabel, Box } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

interface FloatingLabelInputProps extends InputProps {
  label: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, ...inputProps }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <FormControl position="relative" variant="floating" id={inputProps.id}>
      <Input
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" " // necesario para que el label flote
      />
      <FormLabel
        position="absolute"
        left="3"
        top={isFocused || value ? "-2" : "3"}
        fontSize={isFocused || value ? "sm" : "md"}
        color={isFocused ? "blue.500" : "gray.500"}
        pointerEvents="none"
        transition="0.2s all"
      >
        {label}
      </FormLabel>
    </FormControl>
  );
};

export default FloatingLabelInput;
