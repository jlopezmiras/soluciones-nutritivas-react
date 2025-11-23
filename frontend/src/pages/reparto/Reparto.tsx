import React from "react";
import { useState } from "react";
import { Text, 
  Box, 
  Heading,
  useColorModeValue,
  Button,
  HStack, 
  IconButton, 
  Input, 
  InputGroup, 
  InputRightElement,
  Spacer,
  Divider,
 } from "@chakra-ui/react";

import { FiSearch, FiFilter, FiPlus, FiEdit, FiEye } from "react-icons/fi";
import api from "../../api";
import TankApp from "./TankApp";



function Reparto() {

  return (<TankApp/>)
}


export default Reparto;