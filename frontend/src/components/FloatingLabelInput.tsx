import { FormControl, FormLabel, Input, Box, } from "@chakra-ui/react";
import { useState } from "react";

interface FloatingInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function FloatingInput({ label, value, onChange, type = "text" }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl position="relative" mt={4}>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" " // espacio en blanco para activar el floating
        borderRadius="md"
        borderWidth={1}
        p={4}
      />
      <FormLabel
        position="absolute"
        left={4}
        top={value || isFocused ? "-0.8rem" : "50%"}
        transform={value || isFocused ? "translateY(0)" : "translateY(-50%)"}
        fontSize={value || isFocused ? "sm" : "md"}
        color="gray.500"
        pointerEvents="none"
        transition="all 0.2s ease"
        bg="white"
        px={1}
      >
        {label}
      </FormLabel>
    </FormControl>
  );
}
