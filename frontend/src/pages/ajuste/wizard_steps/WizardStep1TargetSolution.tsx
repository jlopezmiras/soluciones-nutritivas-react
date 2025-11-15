import { useState, useEffect } from "react";
import { Box, Button, Input, Text, VStack, Select, Heading } from "@chakra-ui/react";
import api from "../../../api"

interface Water {
  id?: number;
  name: string;
  [key: string]: number | string | undefined;
}

interface Props {
  setSkipToStep: React.Dispatch<React.SetStateAction<number | null>>; 
  setIsStepValid: React.Dispatch<React.SetStateAction<boolean>>; 
  nextStep: (step: number) => void;
}

export default function WizardStep1TargetSolution({ setSkipToStep, setIsStepValid, nextStep }: Props) {
  const [waters, setWaters] = useState<Water[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [form, setForm] = useState<Water>({ name: "", no3: 0, h2po4: 0, so4: 0 });

  useEffect(() => {
    setIsStepValid(false); // disable Next initially
    }, [setIsStepValid]);


  useEffect(() => {
    api.get("/manager/waters/").then(res => setWaters(res.data));
  }, []);


  const onSelectFromDB = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(String(e.target.value));
    setSkipToStep(5); // Set default to step 5 (water)
    setIsStepValid(true);
  };

  const onCreateManually = () => {
    setManual(true);
    setSkipToStep(null);
    setIsStepValid(true);
    nextStep(3);
  };

  return (
    <Box ml={10} >
        <Heading size="md" mb={4}>
          Paso 2: Elegir la solución nutritiva
        </Heading>
         <Text mb={4} color="gray.500">
                Elige la solución nutritiva de la base de datos o pincha en el enlace inferior para 
                introducir los parámetros a mano.
              </Text>

      <VStack spacing={6}>

        {!manual ? (
          <>
            <Select placeholder="Elegir de la base de datos..." onChange={onSelectFromDB}>
              {waters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
            <Button variant="link" onClick={() => {onCreateManually()}}>Introducir los parámetros manualmente</Button>
          </>
        ) : (
          <>
            <Input placeholder="Solution name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
            <Input placeholder="NO₃ (mg/L)" type="number" onChange={e => setForm({ ...form, no3: +e.target.value })}/>
            <Input placeholder="H₂PO₄ (mg/L)" type="number" onChange={e => setForm({ ...form, h2po4: +e.target.value })}/>
            <Input placeholder="SO₄ (mg/L)" type="number" onChange={e => setForm({ ...form, so4: +e.target.value })}/>
          </>
        )}

        </VStack>
    </Box>
  );
}
