import * as wagmi from "wagmi";
import { useProvider, useSigner } from "wagmi";
import AmmContract from "../../../Hardhat/artifacts/contracts/AMM.sol/AMM.json";
import { makeBig, makeNum } from "../../lib/utils";
import useMaticContract from "./useMaticContract";
import useGoflowContract from "./useGoOverFlowContract";

interface PoolDetails {
  totalMatic: string;
  totalGoflow: string;
  totalShares: string;
}

interface UserHoldings {
  userMatic: string;
  userGoflow: string;
  userShares: string;
}

const useAmmContract = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const maticContract = useMaticContract();
  const goflowContract = useGoflowContract();

  const contract = wagmi.useContract({
    // Change this adress after every deploy!
    addressOrName: "0x4d520f78D884D2B24f49D3b4eDB810610350227c",
    contractInterface: AmmContract.abi,
    signerOrProvider: signer || provider,
  });

  const getPoolDetails = async (): Promise<PoolDetails> => {
    const poolDetails = await contract.getPoolDetails();

    // Convert from BigNumber to human readable strings for front-end
    return {
      totalMatic: makeNum(poolDetails.maticAmount),
      totalGoflow: makeNum(poolDetails.goflowAmount),
      totalShares: makeNum(poolDetails.ammShares),
    };
  };

  const getUserHoldings = async (address: string): Promise<UserHoldings> => {
    const userHoldings = await contract.getMyHoldings(address);

    // Convert from BigNumber to human readable strings for front-end
    return {
      userMatic: makeNum(userHoldings.maticAmount),
      userGoflow: makeNum(userHoldings.goflowAmount),
      userShares: makeNum(userHoldings.myShare),
    };
  };

  const getSwapMaticEstimate = async (amountMatic: string): Promise<string> => {
    // find out the amount of GOFLOW we get for a given amount of MATIC
    const goflowEstimateBN = await contract.getSwapMaticEstimate(
      makeBig(amountMatic)
    );
    return makeNum(goflowEstimateBN);
  };

  const getSwapGoflowEstimate = async (
    amountGoflow: string
  ): Promise<string> => {
    // find out the amount of MATIC we get for a given amount of GOFLOW
    const maticEstimateBN = await contract.getSwapGoflowEstimate(
      makeBig(amountGoflow)
    );
    return makeNum(maticEstimateBN);
  };

  const swapMaticForGoflow = async (amountMatic: string): Promise<void> => {
    const amountMaticBN = makeBig(amountMatic);

    await maticContract.approve(contract.address, amountMaticBN);

    const swapTx = await contract.swapMatic(amountMaticBN);
    await swapTx.wait();
  };

  const swapGoflowForMatic = async (amountGoflow: string): Promise<void> => {
    const amountGoflowBN = makeBig(amountGoflow);

    await goflowContract.approve(contract.address, amountGoflowBN);

    const swapTx = await contract.swapGoflow(amountGoflowBN);
    await swapTx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getPoolDetails,
    getUserHoldings,
    getSwapMaticEstimate,
    getSwapGoflowEstimate,
    swapMaticForGoflow,
    swapGoflowForMatic,
  };
};

export default useAmmContract;
