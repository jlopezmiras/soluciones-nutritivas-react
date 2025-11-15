import { useState, useEffect } from "react";
import { Box, Button, Input, Text, VStack, Select, Heading, HStack } from "@chakra-ui/react";
import api from "../../../api"

interface Water {
  id?: number;
  name: string;
  [key: string]: number | string | undefined;
}

interface StepProps {
  setManagerMethod: React.Dispatch<React.SetStateAction<"automatic" | "manual" | null>>;
}

export default function WizardStep3Fertilizers({ setManagerMethod }: StepProps) {
  

  return (
    <Box>
          <Heading size="md" mb={20}>
            Paso 3: Elegir método de ajuste de fertilizantes
          </Heading>
          <HStack 
            spacing={6}
            justifyContent="center"
            display="flex"
            alignItems="center"
            mb={100}
        >
            <Button 
                colorScheme="teal" 
                size="lg" 
                h="100px"
                onClick={() => setManagerMethod("manual")}
            >
            Ajuste manual
            </Button>
            <Button 
                colorScheme="blue" 
                size="lg" 
                h="100px"
                onClick={() => setManagerMethod("automatic")}
            >
            Ajuste automático
            </Button>
        </HStack>
        </Box>
  );
}
