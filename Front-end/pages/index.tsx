import type { NextPage } from "next";
import * as React from "react";
import { Box } from "@chakra-ui/react";
import Questions from "../components/Questions";

const App: NextPage = () => {
  return (
    <Box p={8} maxW="600px" minW="320px" m="0 auto">
      <Questions />
    </Box> 
  );
};

export default App;