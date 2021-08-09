import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure,
  FlexProps,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HamburgerIcon } from "@chakra-ui/icons";

const NavBar = (props: FlexProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      paddingX={12}
      paddingY={8}
      borderBottom="1px"
      borderBottomColor="gray.200"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h2" size="lg" letterSpacing={"tighter"} fontWeight={700}>
          Edward Wong
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <NextLink href="/about">
          <Link as="button" _hover={{ color: "black" }} color="gray.600">
            About
          </Link>
        </NextLink>
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <NextLink href="/login">
          <Button
            variant="outline"
            _hover={{ bg: "gray.50", borderColor: "gray.50" }}
          >
            Sign In
          </Button>
        </NextLink>
      </Box>
    </Flex>
  );
};

export default NavBar;
