
import { Box, SimpleGrid, Text, Button, VStack, Icon, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Card, CardBody, CardHeader, CloseButton, HStack, IconButton, Heading, Divider, Flex, Tooltip } from '@chakra-ui/react';
import { FaWater, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import api from '../../api';
import AddTankModal from './AddTank';
import TestModal from './AddTank';
import AddTankDrawer from './AddTankDrawer';
import TankCard from './TankCard';
import TankGeneralSettings from './TankGeneralSettings';

type Tank = {
  id: number;
  name: string;
  volume: number;
  fertilizers: Record<string, number>;
  flow: number;
  injection: number;
};

// const tanks: Tank[] = [
//   { id: 1, name: 'Tanque A'},
//   { id: 2, name: 'Tanque B'},
//   { id: 3, name: 'Tanque C'},
//   { id: 4, name: 'Tanque D'},
//   { id: 5, name: 'Tanque E'},
// ];


function TankApp() {

  const [tanks, setTanks] = useState<Tank[]>([]);
  // Pop up to manage adding a tank
  const drawerDisclosure = useDisclosure();
  const scrollRef = useRef<HTMLDivElement>(null);
  

  const getTanks = async (): Promise<Tank[]> => {
    try {
      const response = await api.get<Tank[]>('/reparto/tanks');
      console.log('Fetched tanks:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tanks:', error);
      return [];
    }
  }

  
  const deleteTank = async (id: number) => {
    try {
      // Llamada a la API para eliminar el tanque
      await api.delete(`/reparto/tanks/${id}`);

      // Actualizar el estado local eliminando el tanque
      setTanks((prevTanks) => prevTanks.filter((tank) => tank.id !== id));

      console.log(`Tanque con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.error('Error eliminando el tanque:', error);
      alert('Hubo un error al eliminar el tanque');
    }
  };


  
  useEffect(() => {
    const fetchTanks = async () => {
      const data = await getTanks();
      setTanks(data);
    };
    fetchTanks();
  }, [drawerDisclosure.isOpen])


  return (
    <>

    <VStack 
      spacing={0} 
      align="center" 
      height="calc(100vh-var(--chakra-sizes-header))" 
      width="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >

        <Heading fontFamily="'system-ui', sans-serif" fontWeight="200" size="2xl" mb={2}>
          Cálculo de tanques por caudal y por inyección
        </Heading>

        <Flex h="100%" w="100%" alignItems="flex-start" gap={12} overflowY="hidden">
          <TankGeneralSettings />

          {tanks.length === 0 && (
            <Flex
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              direction="column"
              align="center"
              justify="center"
            > 
                <Text fontSize="lg" mb={4}>
                  No hay tanques disponibles. Añade un nuevo tanque para comenzar.
                </Text>
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="teal"
                  onClick={() => drawerDisclosure.onOpen()}
                >
                  Añadir Tanque
                </Button>
            </Flex>
          )}


          {tanks.length > 0 && (
            <Box position="relative" width="100%" overflowY="hidden">


            {/* Contenedor scrollable */}
            <HStack
              ref={scrollRef}
              spacing={6}
              overflowX="auto"
              overflowY={"hidden"}
              // height="calc(100vh-var(--chakra-sizes-header))"
              css={{
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" }, // ocultar scrollbar
              }}
              p={4}
              pt={8}
              pb={16}
            >
              {tanks.map((tank:Tank) => (
                <TankCard
                  key={tank.id}
                  tank={tank}
                  deleteTank={deleteTank}
                  onViewDetails={(id) => console.log('Ver detalles del tanque', id)}
                  />
              ))}

          </HStack>

          </Box>

        )}

    
      </Flex>


      <Tooltip label="Añadir nuevo tanque">
        <IconButton
          aria-label="Añadir tanque"
          icon={<FaPlus size="40px"/>}
          colorScheme="teal"
          boxSize="72px" 
          borderRadius="2xl"
          position="fixed"
          bottom="48px"
          right="24px"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.15)', boxShadow: 'xl' }}
          zIndex={10}
          onClick={() => drawerDisclosure.onOpen()}
        />
      </Tooltip>

    </VStack>

    <AddTankDrawer isOpen={drawerDisclosure.isOpen} onClose={drawerDisclosure.onClose} />

    

    </>
  );
}

export default TankApp;

