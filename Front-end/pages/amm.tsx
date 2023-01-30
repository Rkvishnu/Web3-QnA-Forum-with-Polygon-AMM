import * as React from 'react';
import { NextPage } from 'next/types';
import {
  Box,
  HStack,
  Center,
  Icon,
  Button,
  FormControl
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { MdSwapVert } from 'react-icons/md';
import useAmmContract from '../hooks/contracts/useAmmContract';
import AuthButton from '../components/AuthButton';
import { useAccount } from 'wagmi';
import useSwap from '../hooks/useSwap';
import useEvents from '../hooks/useEvents';
import useAmmDetails from '../hooks/useAmmDetails';
import BalanceDetails from '../components/BalanceDetails';
import TokenSwapperInput from '../components/TokenSwapper';

const Amm: NextPage = () => {
  const [fromMaticText, setFromMaticText] = React.useState('');
  const [fromGoflowText, setFromGoflowText] = React.useState('');
  const [isMaticToGoflow, setIsMatic] = React.useState(true);

  const ammContract = useAmmContract();
  const { address, isConnected } = useAccount();
  const { useSwapMatic, useSwapGoflow } = useSwap();
  const { poolDetailsQuery, userHoldingsQuery } = useAmmDetails();

  const parse = (val: string) => {
    return val.replace(/ [a-zA-Z]+/i, '');
  };

  React.useEffect(() => {
    handleChange(isMaticToGoflow, '1.00');
  }, [poolDetailsQuery.data]);

  useEvents({});

  const handleChange = async (isMatic: boolean, value: string | undefined) => {
    if (!value) {
      setFromMaticText('');
      setFromGoflowText('');
    } else {
      const parsedValue = parse(value);
      
      if (isMatic) {
        setFromMaticText(parsedValue);
        const goflowEstimate = await ammContract.getSwapMaticEstimate(parsedValue);
        setFromGoflowText(goflowEstimate);
      } else {
        setFromGoflowText(parsedValue);
        const maticEstimate = await ammContract.getSwapGoflowEstimate(parsedValue);
        setFromMaticText(maticEstimate);
      }
    }
  };

  const handleClick = async () => {
    try {
      if (isMaticToGoflow) {
        await useSwapMatic.mutateAsync({ maticAmount: fromMaticText });
      } else {
        await useSwapGoflow.mutateAsync({ goflowAmount: fromGoflowText });
      }
      toast.success('Hey 👑. Nice Swap 😎', { duration: 5000 });
    } catch (e: any) {
      toast.error(e.data?.message || e.message);
    }
  };

  return (
    <Box p={1} maxW='500px' minW='320px' m='0 auto'>
      <FormControl>
        <Box p={7} maxW='450px' minW='320px' m='0 auto'>
          <TokenSwapperInput
            changeHandler={handleChange}
            amount={isMaticToGoflow ? fromMaticText : fromGoflowText}
            isMatic={isMaticToGoflow}
            isFrom={true}
          />
          <Center m={-4}>
            <Box transition='transform 0.3s linear' _hover={{ transform: 'rotate(180deg)' }}>
              <Button onClick={() => setIsMatic((current) => !current)} variant='ghost'>
                <Icon as={MdSwapVert} alignSelf='center' boxSize='1.5em' />
              </Button>
            </Box>
          </Center>
          <TokenSwapperInput
            changeHandler={handleChange}
            amount={isMaticToGoflow ? fromGoflowText : fromMaticText}
            isMatic={!isMaticToGoflow}
            isFrom={false}
          />
        </Box>
        <Center m={-3}>
          <AuthButton
            text='SWAP IT!'
            size='sm'
            colorScheme='purple'
            alignSelf='center'
            onClick={handleClick}
            isLoading={useSwapMatic.isLoading || useSwapGoflow.isLoading}
          />
        </Center>
      </FormControl>
      <HStack justifyContent='center' maxW='450px' minW='320px' m='0 auto' pt={8}>
        {isConnected && userHoldingsQuery.data && (
          <BalanceDetails
            title='💰 Your Account 💳'
            address={address || ''}
            matic={userHoldingsQuery.data.userMatic}
            goflow={userHoldingsQuery.data.userGoflow}
            shares={userHoldingsQuery.data.userShares}
          />
        )}
        {poolDetailsQuery.data && (
          <BalanceDetails
            title='⛱ Pool Details 🏦'
            address={ammContract.contract.address}
            matic={poolDetailsQuery.data.totalMatic}
            goflow={poolDetailsQuery.data.totalGoflow}
            shares={poolDetailsQuery.data.totalShares}
          />
        )}
      </HStack>
    </Box>
  );
};

export default Amm;
