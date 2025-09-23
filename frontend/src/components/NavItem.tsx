import React from 'react';
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { motion } from 'framer-motion';
import NavHoverBox from '../components/NavHoverBox';

type NavItemProps = {
  icon: IconType;
  title: string;
  description?: string;
  active?: boolean;
  onClick: React.PointerEventHandler<HTMLDivElement>;
  navSize: 'small' | 'large';
};

const MotionText = motion(Text);

const NavItem: React.FC<NavItemProps> = ({
  icon,
  title,
  description,
  active = false,
  navSize,
  onClick,
}) => {
  return (
    <Flex
      w="100%"
      flexDir="column"
      alignItems="flex-start"
      h="50px"
      cursor="pointer"
      onClick={onClick} // <- aquí lo ponemos
    >
      <Link
        bg={active ? useColorModeValue("light.background.100","dark.background.50") : 'transparent'}
        p={3}
        borderRadius={8}
        _hover={{ textDecor: 'none', bg: '#AEC8CA' }}
        w="full"
        h="100%"
        pointerEvents="none" // <- para que el Link no capture clicks
      >
        <Flex align="center" justify="flex-start" h="100%">
          <Icon
            as={icon}
            fontSize="xl"
            color={active ? '#82AAAD' : 'gray.500'}
          />
          {navSize === 'large' && (
            <MotionText
              ml={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              display="inline-block"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {title}
            </MotionText>
          )}
        </Flex>
      </Link>
    </Flex>
  );
};


export default NavItem;
