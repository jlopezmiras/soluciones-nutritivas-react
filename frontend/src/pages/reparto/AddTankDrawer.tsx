
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Switch,
  VStack,
  Box,
  Text,
  HStack,
  Divider,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import api from '../../api'; // tu función Axios
import { FaCubes, FaDrum, FaFlask } from 'react-icons/fa';
import { GiOilDrum } from 'react-icons/gi';
import { initializeFertilizerColors } from './fertilizerColors';

type AddTankDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

type OtherTanksInfo = {
    tankCount: number;
    existingFertilizers: string[];
}

export default function AddTankDrawer({ isOpen, onClose }: AddTankDrawerProps) {
  const [tankName, setTankName] = useState('');
  const [tankVolume, setTankVolume] = useState<number | "">("");
  const [tankFertilizer, setTankFertilizer] = useState('');
  const [tankFertilizerAmount, setTankFertilizerAmount] = useState<number | "">("");
  const [mixFertilizers, setMixFertilizers] = useState<boolean>(false);
  const [mixFertilizersList, setMixFertilizersList] = useState<string[]>([]);

  const [fertilizers, setFertilizers] = useState<string[]>([]);
  const [mainFertilizerList, setMainFertilizerList] = useState<string[]>([]);
  const [tankCount, setTankCount] = useState<number | "">("");


  // Get al available fertilizers
  const getAvailableFertilizers = async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/reparto/available-fertilizers');
      return response.data;
    } catch (error) {
      console.error('Error fetching fertilizers:', error);
      return [];
    }
  };

  // Get other tanks info: 
  //    - number of tanks to suggest a name
  //    - list of fertilizers to avoid duplicates
  const getOtherTanksInfo = async (): Promise<OtherTanksInfo | null> => {
    try {
      const response = await api.get<OtherTanksInfo>('/reparto/other-tanks-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching fertilizers:', error);
      return null;
    }
  };


  useEffect(() => {
    const fetchOtherTanksInfo = async () => {
        const info = await getOtherTanksInfo();
        if (info) {
            setMainFertilizerList(info.existingFertilizers);
            setTankCount(info.tankCount);
            setTankName("Tanque "+(info.tankCount+1));
        }
    };
    fetchOtherTanksInfo();

    const fetchFertilizers = async () => {
    const data = await getAvailableFertilizers();
    setFertilizers(data);
    initializeFertilizerColors(data);
   };
   fetchFertilizers();

  }, [isOpen])







   // Prepare payload to add a new tank
  const handleSave = async () => {
    if (!tankName || !tankVolume || !tankFertilizer || !tankFertilizerAmount) {
      alert('Completa todos los campos');
      return;
    }
    const payload = {
      name: tankName,
      volume: tankVolume,
      main_fertilizer: tankFertilizer,
      main_fertilizer_qty: tankFertilizerAmount,
      mixed_fertilizers: mixFertilizers ? mixFertilizersList : [],
    }
    await api.post('/reparto/tanks', payload);
    onClose();
    setTankName('');
    setTankVolume(0);
    setTankFertilizer('');
    setTankFertilizerAmount(0);
    setMixFertilizersList([]);
    setMixFertilizers(false);
  };

  return (
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="xl">
            <Text>
              {/* <Icon 
                as={GiOilDrum} // El icono del tanque
                w={6} // Ancho del icono
                h={6} // Alto del icono
                mr={3} // Margen a la derecha para separar del texto
              /> */}
              Añadir nuevo tanque
            </Text>
          </DrawerHeader>

          <Divider borderColor="gray.200" mx={4} mb={4}/>

          <DrawerBody>
            <FormControl mb={4}>
              <FormLabel mb={1}>Nombre del tanque</FormLabel>
              <Input 
                value={tankName} 
                color="gray.700" 
                borderRadius="full"
                onChange={(e) => setTankName(e.target.value)} />
            </FormControl>

            <FormControl mb={12}>
              <FormLabel mb={1}>Volumen (litros)</FormLabel>
              <Input
                type="number"
                value={tankVolume}
                color="gray.700"
                borderRadius="full"
                onChange={(e) => setTankVolume(Number(e.target.value))}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel mb={1}>Fertilizante principal</FormLabel>
              <Select
                placeholder="Selecciona fertilizante"
                value={tankFertilizer}
                color="gray.700"
                borderRadius="full"
                onChange={(e) => setTankFertilizer(e.target.value)}
              >
                {fertilizers
                  .filter(fert => !mainFertilizerList.includes(fert))
                  .map((fert) => (
                <option value={fert}>{fert}</option>
                ))
                }
              </Select>
            </FormControl>

             <FormControl mb={8}>
              <FormLabel mb={1}>Cantidad</FormLabel>
              <Input
                type="number" 
                value={tankFertilizerAmount} 
                color="gray.700"
                borderRadius="full"
                onChange={(e) => setTankFertilizerAmount(Number(e.target.value))}
                isDisabled={tankFertilizer === ''} />
            </FormControl>


            <FormControl mb={2}>
              <HStack>
                <FormLabel  mb="0" display="flex">Mezclar con otros fertilizantes</FormLabel>
                <Switch isChecked={mixFertilizers} onChange={(e) => setMixFertilizers(e.target.checked)}/>
              </HStack>
            </FormControl>

            {mixFertilizers && (
              <FormControl mb={4}>
              <SelectableList 
                items={fertilizers
                    .filter(fert => fert !== tankFertilizer)
                    .map((fert, index) => ({ id: index, label: fert }))}
                onChange={(selectedItems) => setMixFertilizersList(selectedItems.map(item => item.label))}
              />
              </FormControl>
            )}

          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={handleSave}>
              Guardar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
}




interface Item {
  id: number;
  label: string;
}

interface SelectableListProps {
  items: Item[];
  maxHeight?: string; // para scroll
  onChange?: (selectedItems: Item[]) => void;
}

export function SelectableList({ items, maxHeight = "600px", onChange }: SelectableListProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) => 
{
      const newSelected = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];

      // Notificar al padre
      onChange?.(items.filter(item => newSelected.includes(item.id)));

      return newSelected;
    });
  };


  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      p={2}
      maxHeight={maxHeight}
      overflowY="auto"
    >
      <VStack spacing={1} align="stretch">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <Box
              key={item.id}
              p={3}
              borderRadius="md"
              cursor="pointer"
              color="gray.700"
              bg={isSelected ? "gray.300" : "transparent"}
              _hover={{ bg: isSelected ? "gray.300" : "gray.200" }}
              transition="background-color 0.05s"
              onClick={() => toggle(item.id)}
            >
              <Text color={isSelected ? "gray.700" : "gray.900"} my={0}>
                {item.label}
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
