
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../../api'; // tu función Axios

type TankFormProps = {
    isOpen: boolean;
    onClose: () => void;
  onTankAdded: () => void; // para recargar la lista tras añadir
};

export function AddTankModal({ isOpen, onClose, onTankAdded }: TankFormProps) {
  const [nombre, setNombre] = useState('');
  const [volumen, setVolumen] = useState<number>(0);
  const [fertilizante, setFertilizante] = useState('');

  console.log('Modal abierto:', isOpen);


  const addTank = async (tankData: { nombre: string; volumen: number; fertilizantes: Record<string, number> }) => {
    try {
      const response = await api.post('/reparto/tanks', tankData);
      console.log('Tank added:', response.data);
    } catch (error) {
      console.error('Error adding tank:', error);
    }
 };

  const handleSave = async () => {
    if (!nombre || !volumen || !fertilizante) {
      alert('Completa todos los campos');
      return;
    }
    await addTank({
      nombre,
      volumen,
      fertilizantes: { [fertilizante]: 0 }, // inicializamos cantidad en 0
    });
    onTankAdded();
    onClose();
    setNombre('');
    setVolumen(0);
    setFertilizante('');
  };

  return (
    <>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir nuevo tanque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nombre del tanque</FormLabel>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Volumen (litros)</FormLabel>
              <Input
                type="number"
                value={volumen}
                onChange={(e) => setVolumen(Number(e.target.value))}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Fertilizante</FormLabel>
              <Select
                placeholder="Selecciona fertilizante"
                value={fertilizante}
                onChange={(e) => setFertilizante(e.target.value)}
              >
                <option value="Nitrato">Nitrato</option>
                <option value="Fosfato">Fosfato</option>
                <option value="Potasio">Potasio</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}




export default function TestModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Abrir Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prueba</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Contenido del modal</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
