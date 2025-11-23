import { useState } from "react";
import {  
  Box, 
  Flex, 
  useColorModeValue,
  } from "@chakra-ui/react";


import Biblioteca from "./pages/biblioteca/Biblioteca";
import Ajuste from "./pages/ajuste/Ajuste";
import Reparto from "./pages/reparto/Reparto";
import Header from "./components/Header";




function App() {
  const [tab, setTab] = useState("ajuste");
  // const {toggleColorMode, colorMode } = useColorMode(); // Hook para cambiar el tema

  const tabs = [
    { key: "biblioteca", label: "Biblioteca" },
    { key: "ajuste", label: "Ajuste" },
    { key: "reparto", label: "Reparto" },
  ];
  


  return (
    
        <Flex direction="column" h="100vh">
        <Header tabs={tabs} onTabChange={(tab) => setTab(tab.key)} />

        {/* Contenido principal */}
        <Box
          flex="1"
          pt={0}
          p={6}
          bg={useColorModeValue("light.background.main", "dark.background.main")}
          // bgGradient="linear(to-br, purple.200, orange.100)"
          color={useColorModeValue("light.text", "dark.text")}
          overflow="auto"
        >
          {tab === "biblioteca" && <Biblioteca />}
          {tab === "ajuste" && <Ajuste />}
          {tab === "reparto" && <Reparto />}
        </Box>

        {/* Barra inferior */}
        {/* <Flex
          justify="center"
          align="center"
          bg={bgBar}
          borderTop="2px solid"
          borderColor={borderBar}
          h="50px"
        >
          <Flex h="full">
            {tabs.map((t) => (
              <Button
                key={t.key}
                onClick={() => setTab(t.key)}
                borderRadius="0"
                variant="ghost"
                px={8}
                fontWeight="bold"
                color={tab === t.key ? colorActive : colorInactive}
                bg={tab === t.key ? bgActive : "transparent"}
                h="full"
                _hover={{
                  bg: useColorModeValue("gray.300", "gray.600"),
                  color: useColorModeValue("black", "white"),
                }}
                _active={{ bg: bgActive }}
              >
                {t.label}
              </Button>
            ))}
          </Flex> 
        </Flex>*/}
      </Flex>
  );
}

export default App;

