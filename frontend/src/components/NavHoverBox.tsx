import { Flex, Heading, Text, Icon } from "@chakra-ui/react";
import type { ElementType } from "react";

interface NavHoverBoxProps {
  title: string;
  icon: ElementType;
  description?: string;
}

export default function NavHoverBox({
  title,
  icon,
  description,
}: NavHoverBoxProps) {
  return (
    <>
      {/* Arrow pointer */}
      <Flex
        position="absolute"
        mt="calc(100px - 7.5px)"
        ml="-10px"
        width={0}
        height={0}
        borderTop="10px solid transparent"
        borderBottom="10px solid transparent"
        borderRight="10px solid #82AAAD"
      />
      {/* Hover box content */}
      <Flex
        h={200}
        w={200}
        flexDir="column"
        align="center"
        justify="center"
        bg="#82AAAD"
        borderRadius="10px"
        color="white"
        textAlign="center"
      >
        <Icon as={icon} fontSize="3xl" mb={4} />
        <Heading size="md" fontWeight="normal">
          {title}
        </Heading>
        {description && <Text>{description}</Text>}
      </Flex>
    </>
  );
}
