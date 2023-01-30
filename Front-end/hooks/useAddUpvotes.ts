import { makeBig } from '../lib/utils';
import { useMutation } from 'react-query';
import useGoOverFlowContract from './contracts/useGoOverFlowContract';


interface UseApprovePayload {
    address: string;
    amount: string;
}

const useAddApprove = () => {
    const contract = useGoOverFlowContract();
    return useMutation(
        async ({ address, amount }: UseApprovePayload) => {
            await contract.approve(address, makeBig(amount))
        }
    )
}

export default useAddApprove;