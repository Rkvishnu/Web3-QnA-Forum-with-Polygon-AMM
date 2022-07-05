import type { NextPage } from 'next';
import * as React from 'react';
import { Box, Stack, Text, Image } from '@chakra-ui/react';

const Amm: NextPage = () => {
  return (
    <Box p={8} maxW='600px' minW='320px' m='0 auto'>
      <Stack align='center'>
        <Image src='https://c.tenor.com/CHc0B6gKHqUAAAAj/deadserver.gif' />
        <br />
        <Text>Nothing to see here... yet</Text>
      </Stack>
    </Box>
  );
};

export default Amm;
