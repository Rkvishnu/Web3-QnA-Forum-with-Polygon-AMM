import { useMutation } from 'react-query';
import useAmmContract from './contracts/useAmmContract';

interface UseSwapPayload {
  maticAmount?: string;
  goflowAmount?: string;
}

const useSwap = () => {
  const ammContract = useAmmContract();

  const useSwapMatic = useMutation(async ({ maticAmount }: UseSwapPayload) => {
    if (maticAmount) {
      await ammContract.swapMaticForGoflow(maticAmount);
    }
  });

  const useSwapGoflow = useMutation(async ({ goflowAmount }: UseSwapPayload) => {
    if (goflowAmount) {
      await ammContract.swapGoflowForMatic(goflowAmount);
    }
  });

  return { useSwapMatic, useSwapGoflow };
};

export default useSwap;