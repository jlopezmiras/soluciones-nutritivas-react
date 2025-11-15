import { useState, useEffect } from "react";
import { Box, Button, Input, Text, VStack, Select, Heading } from "@chakra-ui/react";
import api from "../../api"

interface Water {
  id?: number;
  name: string;
  [key: string]: number | string | undefined;
}

interface Props {
  onNext: (solution: Water) => void;
  onBack?: () => void; 
}

export default function WaterWizard({ onNext, onBack }: Props) {
  const [waters, setWaters] = useState<Water[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [manual, setManual] = useState(false);
  const [form, setForm] = useState<Water>({ name: "", no3: 0, h2po4: 0, so4: 0 });

  useEffect(() => {
    api.get("/manager/waters/").then(res => setWaters(res.data));
  }, []);

  const handleSelect = () => {
    const sol = waters.find(s => s.id === selected);
    if (sol) onNext(sol);
  };

  return (
    <VStack spacing={6}>
      <Heading size="md"> Define your target nutrient solution</Heading>

      {!manual ? (
        <>
          <Select placeholder="Select from database" onChange={e => setSelected(Number(e.target.value))}>
            {waters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Button colorScheme="blue" onClick={handleSelect} isDisabled={!selected}>Next</Button>
          <Button variant="link" onClick={() => setManual(true)}>Or create manually</Button>
        </>
      ) : (
        <>
          <Input placeholder="Solution name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
          <Input placeholder="NO₃ (mg/L)" type="number" onChange={e => setForm({ ...form, no3: +e.target.value })}/>
          <Input placeholder="H₂PO₄ (mg/L)" type="number" onChange={e => setForm({ ...form, h2po4: +e.target.value })}/>
          <Input placeholder="SO₄ (mg/L)" type="number" onChange={e => setForm({ ...form, so4: +e.target.value })}/>
          <Button colorScheme="blue" onClick={() => onNext(form)}>Next</Button>
        </>
      )}
    </VStack>
  );
}
