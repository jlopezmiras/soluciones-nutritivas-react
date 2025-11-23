import { Box, Text, Button, VStack, Icon, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Card, CardBody, CardHeader, CloseButton, HStack, IconButton } from '@chakra-ui/react';
import { FaWater, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import api from '../../api';
import AddTankDrawer from './AddTankDrawer';
import TankCard from './TankCard';

type Tank = {
  id: number;
  name: string;
  volume: number;
  fertilizers: Record<string, number>;
  flow: number;
  injection: number;
};

function GalleryCards() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const drawerDisclosure = useDisclosure();

  // Estado para la "ventana" de cards visibles
  const [start, setStart] = useState(0);

  // Calcula cuántas cards entran según ancho de pantalla
  const computeCardsPerScreen = () => Math.max(1, Math.floor(window.innerWidth / 450));
  const [cardsPerScreen, setCardsPerScreen] = useState(computeCardsPerScreen());

  useEffect(() => {
    const handleResize = () => setCardsPerScreen(computeCardsPerScreen());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTanks = async (): Promise<Tank[]> => {
    try {
      const response = await api.get<Tank[]>('/reparto/tanks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tanks:', error);
      return [];
    }
  };

  const deleteTank = async (id: number) => {
    try {
      await api.delete(`/reparto/tanks/${id}`);
      setTanks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error eliminando tanque:', error);
    }
  };

  useEffect(() => {
    const fetchTanks = async () => {
      const data = await getTanks();
      setTanks(data);
    };
    fetchTanks();
  }, [drawerDisclosure.isOpen]);

  // Funciones tipo carousel
  const handleRight = () => {
    if (start + cardsPerScreen < tanks.length) setStart(start + 1);
  };

  const handleLeft = () => {
    if (start > 0) setStart(start - 1);
  };

  const visibleTanks = tanks.slice(start, start + cardsPerScreen);

  return (
    <>
      <Box position="relative" width="100%" p={4} height="calc(100vh - var(--chakra-sizes-header))">

        {/* Flecha izquierda */}
        <IconButton
          aria-label="Scroll left"
          icon={<FaChevronLeft />}
          position="absolute"
          left="0"
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}
          onClick={handleLeft}
          variant="solid"
          colorScheme="teal"
        />

        {/* Contenedor sin scroll, solo ventana */}
        <HStack
          spacing={6}
          overflow="hidden"
          height="calc(100vh - var(--chakra-sizes-header))"
          p={4}
          pb={16}
        >
          {visibleTanks.map((tank: Tank) => (
            <TankCard
              key={tank.id}
              tank={tank}
              deleteTank={deleteTank}
              onViewDetails={(id) => console.log('Ver detalles', id)}
            />
          ))}

          {/* Card para añadir tanque */}
          <Card
            key="add-tank"
            role="group"
            bg="white"
            height="full"
            maxW="120px"
            p={4}
            borderRadius="lg"
            borderColor="gray.200"
            borderWidth={2}
            boxShadow="lg"
            transition="all 0.3s"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
            onClick={() => drawerDisclosure.onOpen()}
            alignSelf="flex-end"
          >
            <Icon as={FaPlus} boxSize={12} color="teal.500" />
          </Card>
        </HStack>

        {/* Flecha derecha */}
        <IconButton
          aria-label="Scroll right"
          icon={<FaChevronRight />}
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}
          onClick={handleRight}
          variant="solid"
          colorScheme="teal"
        />
      </Box>

      <AddTankDrawer isOpen={drawerDisclosure.isOpen} onClose={drawerDisclosure.onClose} />
    </>
  );
}

export default GalleryCards;
