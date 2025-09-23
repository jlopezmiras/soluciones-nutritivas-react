import { Box, Heading, SimpleGrid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
  const isLargeScreen = useBreakpointValue({ base: false, md: true });

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10} ml={10} pl={0}>
      <GridItem
        as={Box}
        colSpan={{ base: 1, md: 1 }}
        textAlign={{ base: 'center', md: 'right' }}
        pr={{ base: 0, md: 6 }}
      >
        <Heading as="h3" size="md" color="gray.700" wordBreak="break-word">
          {title}
        </Heading>
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 1 }}>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
          {children}
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};