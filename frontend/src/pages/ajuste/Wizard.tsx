import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Circle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import WizardStep1ATargets from "./wizard_steps/WizardStep1ATargets";
import WizardStep1BLock from "./wizard_steps/WizardStep1BLock";
import WizardStep1CThresholds from "./wizard_steps/WizardStep1CThresholds";
import WizardStep1TargetSolution from "./wizard_steps/WizardStep1TargetSolution";
import WizardStep2Water from "./wizard_steps/WizardStep2Water";
import api from "../../api";
import WizardStep3Fertilizers from "./wizard_steps/WizardStep3Fertilizers";
import TableManager from "./TableManager";

export default function Wizard() {
  const [step, setStep] = useState(1);

  // Payload to the solution manager
  const [data, setData] = useState({
    solution: {
      targets: {},
      locked: [],
      thresholds: {
        min : {},
        max : {}
      }
    },
    water: {}
  });

  const [skipToStep, setSkipToStep] = useState<number | null>(null);
  const [isStepValid, setIsStepValid] = useState<boolean>(true);
  const [maxStepReached, setMaxStepReached] = useState(1);

  // Method to fit fertilizers: automatic or manual
  const [managerMethod, setManagerMethod] = useState<"automatic" | "manual" | null>(null);


  const totalSteps = 5;
  const stepBg = useColorModeValue("white", "gray.800");

  const colorActive = useColorModeValue("blue.500", "blue.300");
  const colorCompleted = useColorModeValue("blue.200", "blue.600");
  const colorUpcoming = useColorModeValue("gray.300", "gray.600");

  const steps = [
    { id: 1, label: "Elegir agua de riego" },
    { id: 2, label: "Elegir solución nutritiva" },
    { id: 3, label: "Nutrientes objetivo" },
    // { id: 4, label: "Nutrientes sin aporte" },
    { id: 4, label: "Límites de nutrientes" },
    { id: 5, label: "Ajuste de fertilizantes" }
  ];

  const next = () => {
    console.log("step",step);
    if (step === 4) handleManagerCreation();
    if (skipToStep) {
      setStep(skipToStep);
      setSkipToStep(null);
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleManagerCreation = () => {
    // Prepare payload and send to API
    const payload = data;
    console.log(data);

    try {
      // Send to API
      api.post("/manager/manual/create-manager/", payload).then((res) => {
        console.log("Solution manager created:", res.data);
      });
    } catch (err) {
      console.error("Error creating solution manager:", err);
    }

  }

  const resetManager = () => {
    try {
      // Send to API
      api.post("/manager/manual/reset-manager/");
    } catch (err) {
      console.error("Error reseting solution manager:", err);
    }
  }


  const renderStep = () => {
    
    if (step==5 && managerMethod != null) {
      switch (managerMethod) {
        case "manual":
          return <TableManager />;
        case "automatic":
          return <Text>Ajuste automático seleccionado. (No implementado aún)</Text>;
        default:
          return null;
      }
    }

    switch (step) {
      case 1:
        return <WizardStep2Water data={data} setData={setData} setIsStepValid={setIsStepValid} />;
      case 2:
        return <WizardStep1TargetSolution setSkipToStep={setSkipToStep} setIsStepValid={setIsStepValid} nextStep={setStep}/>;
      case 3:
        return <WizardStep1ATargets data={data} setData={setData} />;
      // case 4:
      //   return <WizardStep1BLock data={data} setData={setData} />;
      case 4:
        return <WizardStep1CThresholds data={data} setData={setData} />;
      case 5:
        return <WizardStep3Fertilizers setManagerMethod={setManagerMethod} />;
      default:
        return null;
    }
  };

  // Do things when step changes
  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step));

    // If managerMethod is not null it means that we were in step 6, so we should reset the manager
    if (managerMethod != null && step < 5) resetManager();
  }, [step]);



  return (
    <Box 
      p={6} 
      borderWidth="1px" 
      borderRadius="xl" 
      bg={stepBg} 
      shadow="md" 
      minHeight="100%"
      display="flex"
      flexDirection="column"
    >
      {/* --- Centered Progress Bar --- */}
      <Box
        position="relative"
        mb={10}
        maxW="1200px"
        mx="auto"
        px={1}
      >
        {/* Connector line behind bullets */}
        <Box
          position="absolute"
          top="16px"
          left="0"
          right="0"
          height="4px"
          bg={colorUpcoming}
          zIndex={0}
          borderRadius="full"
        />
        {/* Completed portion */}
        <Box
          position="absolute"
          top="16px"
          left="0"
          height="4px"
          width={`${((maxStepReached - 1) / (steps.length - 1)) * 100}%`}
          bg={maxStepReached > 1 ? colorCompleted : colorUpcoming}
          zIndex={1}
          borderRadius="full"
          transition="width 0.3s ease"
        />

        <HStack justify="space-between" position="relative" zIndex={2}>
          {steps.map((s) => {
            let bgColor = colorUpcoming;
            if (s.id < step) bgColor = colorCompleted;    // completed before current
            if (s.id === step) bgColor = colorActive;     // active
            if (s.id > step && s.id <= maxStepReached) bgColor = colorCompleted; // reached but not active

            return (
              <VStack key={s.id} spacing={2} cursor={s.id <= maxStepReached ? "pointer" : "default"}
                onClick={() => {
                  if (s.id <= maxStepReached) setStep(s.id); // only allow going backwards
                }}
              >
                <Circle
                  size="36px"
                  bg={bgColor}
                  color="white"
                  fontWeight="bold"
                  shadow={s.id === step ? "md" : "none"}
                  transition="background-color 0.3s ease"
                >
                  {s.id}
                </Circle>
                <Text
                  fontSize="sm"
                  fontWeight={s.id === step ? "bold" : "normal"}
                  color={
                    s.id === step
                      ? colorActive
                      : s.id < maxStepReached
                      ? colorCompleted
                      : colorUpcoming
                  }
                >
                  {s.label}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </Box>

      {/* --- Step Content --- */}
      {renderStep()}

      {/* --- Navigation --- */}
      <HStack justify="space-between" mt={"auto"}>
        <Button onClick={back} isDisabled={step === 1}>
          Anterior
        </Button>
        <Button colorScheme="blue" onClick={next} disabled={!isStepValid}>
          {step === totalSteps ? "Terminar" : "Siguiente"}
        </Button>
      </HStack>
    </Box>
  );
}
