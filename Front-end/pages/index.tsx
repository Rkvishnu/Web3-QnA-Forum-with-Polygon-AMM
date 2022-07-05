import type { NextPage } from 'next';
import * as React from 'react';
import { Box, Text, Stack, Image } from '@chakra-ui/react';

const App: NextPage = () => {
  return (
    <Box p={8} maxW='600px' minW='320px' m='0 auto'>
      <Stack align='center'>
        <Image width={300} src='https://c.tenor.com/ILZS6yuNQ3wAAAAC/yo-chris-farley.gif' />
        <Text align='center'>
          This is the beginning of a journey through the DeFi universe
          <br />
          with our good friends at Polygon
        </Text>
      </Stack>
    </Box>
  );
};

export default App;
