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

import TopTable from "./TopTable";
import { FiSearch, FiFilter, FiPlus, FiEdit, FiEye } from "react-icons/fi";
import FertilizerGrid from "./FertilizerGrid";
import api from "../../api";
import Wizard from "./Wizard";



function Ajuste() {

  return (<Wizard/>)
}


export default Ajuste;