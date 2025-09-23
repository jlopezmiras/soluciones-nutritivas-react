import { Grid, GridItem, Heading, Box, useBreakpointValue, Text } from '@chakra-ui/react';
import React from 'react';
import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  return (
    <Grid
      templateColumns={{ base: '1fr', md: 'minmax(0, max-content) 1fr' }} // Ancho del título flexible, contenido flexible
      gap={6}
      mb={10}
      w="full"
      alignItems="flex-start" // Alinea los elementos en la parte superior
    >
      <GridItem
        as={Box}
        textAlign={{ base: 'center', md: 'right' }}
        pr={{ base: 0, md: 6 }}
      >
        <Heading as="h3" size="md" color="gray.700" wordBreak="break-word">
          {title}
        </Heading>
      </GridItem>
      <GridItem>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" w="100%">
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
};




export default FormSection;