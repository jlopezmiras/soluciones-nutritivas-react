import React from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  Tabs,
  TabList,
  Tab,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { SiZensar } from "react-icons/si";

interface TabOption {
  label: string;
  key: string; // opcional, por si quieres pasar un identificador
}

interface HeaderProps {
  tabs: TabOption[];
  onTabChange: (tab: TabOption) => void;
}

const Header: React.FC<HeaderProps> = ({ tabs, onTabChange }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("light.background.main", "dark.background.main");
  const textColor = useColorModeValue("gray.800", "white");
  const tabColorScheme = useColorModeValue("light.secondary", "light.secondary");
  

  return (
    <Box
      as="header"
      w="100%"
      h="var(--chakra-sizes-header)"
      bg={bgColor}
      color={textColor}
      px={6}
      py={3}
      boxShadow="md"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Flex align="center" justify="space-between">
        {/* Logo + Nombre */}
        <Flex align="center" gap={3}>
          <Image
            src="/logo.svg" // tu logo aquí
            alt="Logo"
            boxSize="40px"
            objectFit="contain"
          />
          <Heading size="md" fontWeight="regular" fontSize="2xl" fontFamily="'Raleway', sans-serif">
            Cultitecno Nutrigrow
          </Heading>
        </Flex>

        {/* Navegación con Tabs y botón de tema */}
        <Flex align="center" gap={4}>
          <Tabs variant="soft-rounded" colorScheme={tabColorScheme}>
            <TabList gap={4}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  fontWeight="semibold"
                  onClick={() => onTabChange(tab)}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>

          {/* Botón para cambiar tema */}
          <IconButton
            aria-label="Toggle Theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
