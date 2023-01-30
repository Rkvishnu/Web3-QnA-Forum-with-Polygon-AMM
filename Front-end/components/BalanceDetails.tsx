import * as React from 'react';
import { Text, Stack, Badge } from '@chakra-ui/react';
import Username from '../components/Username';

interface BalanceProps {
  title: string;
  address: string;
  matic: string;
  goflow: string;
  shares: string;
}

const BalanceDetails: React.FunctionComponent<BalanceProps> = ({ title, address, matic, goflow, shares }) => {
  return (
    <Stack borderWidth='1px' rounded='md' p={5} align='stretch'>
      <Stack direction='column'>
        <Text color='white' fontSize='lg'>
          {title}
        </Text>
        <Badge borderRadius='full' px='5' color='purple.400' colorScheme='purple' alignSelf='center'>
          <Username address={address} />
        </Badge>
      </Stack>
      <Stack>
        <Text px='8px' fontSize='sm' color='gray.400'>
          {'MATIC: ' + matic}
        </Text>
        <Text px='8px' fontSize='sm' color='gray.400'>
          {'GOFLOW: ' + goflow}
        </Text>
        <Text px='8px' fontSize='sm' color='gray.200'>
          {'SHARES: ' + shares}
        </Text>
      </Stack>
    </Stack>
  );
};

export default BalanceDetails;
