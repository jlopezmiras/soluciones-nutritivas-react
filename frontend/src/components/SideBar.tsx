import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import NavItem from './NavItem';

type NavSize = 'small' | 'large';

interface SidebarItem {
  key: string;
  label: string;
  icon: IconType;
}

interface SidebarProps {
  items: SidebarItem[];
  onItemClick: (item: SidebarItem) => void;
}

const MotionFlex = motion(Flex);

export default function Sidebar({ items, onItemClick }: SidebarProps) {
  const [navSize, setNavSize] = useState<NavSize>('large');
  const [activeKey, setActiveKey] = useState<string>(items[0].key);

  const toggleNavSize = () => {
    setNavSize((prev) => (prev === 'small' ? 'large' : 'small'));
  };

  const bgColor = useColorModeValue("light.background.50", 'dark.background.900');

  return (
    <MotionFlex
      pos="sticky"
      left={5}
      h="80vh"
      mt="0vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize === 'small' ? '15px' : '30px'}
      flexDir="column"
      justifyContent="space-between"
      p={4}
      bg={bgColor}
      animate={{ width: navSize === 'small' ? 75 : 250 }}
      initial={false}
      transition={{ duration: 0.6, type: 'spring', stiffness: 70, damping: 12 }}
    >
      <VStack as="nav" spacing={3} align="center">
        <IconButton
          aria-label="Toggle sidebar"
          bg="none"
          _hover={{ bg: 'none' }}
          icon={<FiMenu />}
          alignSelf="flex-start"
          onClick={toggleNavSize}
        />

        {items.map((item) => (
          <NavItem
            key={item.key}
            navSize={navSize}
            icon={item.icon}
            title={item.label}
            onClick={() => {setActiveKey(item.key),
                            onItemClick(item)}}
            active={activeKey === item.key} // <- marcar activo
          />
        ))}
      </VStack>
    </MotionFlex>
  );
}
