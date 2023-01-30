import { makeBig } from "../lib/utils";
import { useMutation } from "react-query";
import useGoOverFlowContract from './contracts/useGoOverFlowContract';

interface UseMintPayload {
    amount: string;
}

// We’ll are using a mutation hook for our mint function
//  because each time we mint, we are changing the state of our token contract. Name this file useAddMint.ts:
const useAddMint = () => {
    const contract = useGoOverFlowContract();
    return useMutation(async ({ amount }: UseMintPayload) => {
        await contract.mint(makeBig(amount));
    });
};

export default useAddMint;