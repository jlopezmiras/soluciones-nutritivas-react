import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import api from "../../api";
import SolutionsForm from "./SolutionsForm";
import IrrigationWaterForm from "./IrrigationWaterForm";
import WaterWizard from "./WaterWizard";

const PROPS = [
  "no3",
  "h2po4",
  "so4",
  "hco3",
  "cl",
  "na",
  "ca",
  "mg",
  "k",
  "nh4",
];

interface Fertilizer {
  id: number;
  name: string;
  [key: string]: number | string;
}

export default function Wizard() {
  const [step, setStep] = useState(0);

  const [idealSolution, setIdealSolution] = useState<any>(null);
  const [water, setWater] = useState<any>(null);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Flex direction="column" gap={6} w="full" mx="auto" py={8}>
      <Heading size="lg" textAlign="center">
        Nutrient Solution Wizard
      </Heading>

      {step === 0 && (
          <SolutionsForm
            onSubmit={(data: any) => {
              setIdealSolution(data);
              next();
            }}
          />
      )}

      {step === 1 && (
          <WaterWizard
            onNext={(data: any) => {
              setWater(data);
              next();
            }}
            onBack={back}
          />
      )}

      {step === 2 && (
        <Box>
          <Tabs isFitted variant="enclosed">
            <TabList>
              {PROPS.map((prop) => (
                <Tab key={prop} textTransform="uppercase">
                  {prop}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {PROPS.map((prop) => (
                <TabPanel key={prop}>
                  <FertilizerList property={prop} />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      )}

      <Flex justify="space-between">
        {step > 0 && <Button onClick={back}>Back</Button>}
        {step < 2 && <Button onClick={next}>Next</Button>}
      </Flex>
    </Flex>
  );
}

function FertilizerList({ property }: { property: string }) {
  const [loading, setLoading] = useState(false);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .get(`/fertilizers?component=${property}`)
      .then((res) => {
        console.log(res.data);
        if (isMounted) {
          setFertilizers(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [property]);

  if (loading) {
    return <Spinner />;
  }

  if (!fertilizers.length) {
    return <Text>No fertilizers found for {property}</Text>;
  }


  return (
    <VStack align="stretch" spacing={3}>
      {fertilizers.map((fert) => (
        <Box
          key={fert.id}
          borderWidth="1px"
          borderRadius="lg"
          p={3}
          shadow="sm"
        >
          <Heading size="sm">{fert.name}</Heading>
          <Text fontSize="sm" color="gray.600">
            Contains {property.toUpperCase()}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
