import * as React from 'react';
import {
  Text,
  Icon,
  Stack, 
  HStack, 
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { GiReceiveMoney } from 'react-icons/gi';
import { MdPointOfSale } from 'react-icons/md';

interface TokenSwapperProps extends NumberInputProps {
  changeHandler: (isMatic: boolean, amount: string) => void;
  amount: string;
  isMatic: boolean;
  isFrom: boolean;
}

const TokenSwapperInput: React.FunctionComponent<TokenSwapperProps> = ({ changeHandler, amount, isMatic, isFrom }) => {
  return (
    <Stack m={1} p={3} flex={1} bg={isMatic ? 'purple.900' : 'whiteAlpha.300'} rounded='md'>
      <FormLabel htmlFor={isFrom ? 'from' : 'to'}>
        {isFrom ? (
          <HStack>
            <Icon as={MdPointOfSale} />
            <Text>From: </Text>
          </HStack>
        ) : (
          <HStack>
            <Icon as={GiReceiveMoney} />
            <Text>To: </Text>
          </HStack>
        )}
      </FormLabel>
      <NumberInput
        onChange={(value) => changeHandler(isMatic, value)}
        focusBorderColor={'gray.400'}
        value={amount + (isMatic ? ' MATIC' : ' GOFLOW')}
        isDisabled={!isFrom}
        precision={2}
        step={0.1}
        min={1.0}
        size='lg'
      >
        <NumberInputField id={isFrom ? 'from' : 'to'} />
        {isFrom ? (
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        ) : null}
      </NumberInput>
    </Stack>
  );
};

export default TokenSwapperInput;