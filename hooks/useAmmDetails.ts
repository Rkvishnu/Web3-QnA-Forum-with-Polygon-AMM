import { useQuery } from 'react-query';
import useAmmContract from './contracts/useAmmContract';
import { useAccount } from 'wagmi';

const useAmmDetails = () => {
  const ammContract = useAmmContract();
  const { address } = useAccount();

  const poolDetailsQuery = useQuery(['poolDetails'], async () => {
    return await ammContract.getPoolDetails();
  });

  const userHoldingsQuery = useQuery(['userHoldings', address], async () => {
    if (address) {
      return await ammContract.getUserHoldings(address);
    } 
  }, { enabled: !!address });

  return { poolDetailsQuery, userHoldingsQuery };
};

export default useAmmDetails;