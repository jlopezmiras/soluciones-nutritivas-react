import { VStack, Input, Button, Textarea, Checkbox, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { FormSection } from './FormSection';

const FertilizantsForm = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Formulario enviado');
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={8} p={8} pl={0} bg="gray.50" borderRadius="md">
      {/* Sección de Información Personal */}
      <FormSection title="Información Personal">
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6} w="full">
          <Input placeholder="Nombre" />
          <Input placeholder="Apellido" />
          <Input placeholder="Correo Electrónico" type="email" />
          <Input placeholder="Teléfono" type="tel" />
        </SimpleGrid>
      </FormSection>

      {/* Sección de Dirección */}
      <FormSection title="Dirección de Contacto">
        <VStack spacing={6} w="full">
          <Input placeholder="Calle y número" />
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6} w="full">
            <Input placeholder="Ciudad" />
            <Input placeholder="Código Postal" />
          </SimpleGrid>
          <Input placeholder="País" />
        </VStack>
      </FormSection>

      {/* Sección de Comentarios */}
      <FormSection title="Comentarios Adicionales">
        <VStack spacing={4} w="full">
          <Textarea placeholder="Escribe aquí tus comentarios..." />
          <Checkbox defaultChecked>Acepto los términos y condiciones</Checkbox>
        </VStack>
      </FormSection>

      {/* Botón de envío */}
      <Button colorScheme="blue" type="submit" alignSelf="flex-end" mt={6}>
        Enviar
      </Button>
    </VStack>
  );
};


export default FertilizantsForm;