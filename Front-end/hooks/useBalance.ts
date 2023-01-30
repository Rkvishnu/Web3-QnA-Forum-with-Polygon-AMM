import { useAccount } from 'wagmi';
import { useQuery } from "react-query";
import useGoOverFlowContract from './contracts/useGoOverFlowContract';
import useForumContract from './contracts/useForumContract';


// Just as we did with our Questions, Answers, and Upvotes 
// we need to create a read query for our token Balances


const useBalance = () => {

    //contract instances
    const forumContract = useForumContract();
    const goOverFlowContract = useGoOverFlowContract();

    const { address: account } = useAccount(); //from wagmi

    const contractBalanceQuery = useQuery(
        ['contractBalance'],
        async () => {
            return await goOverFlowContract.getBalance(forumContract.contract.address);
        }
    );

    const userBalanceQuery = useQuery(
        ['userBalance', account],
        async () => {
            if (account) {
                return await goOverFlowContract.getBalance(account)
            }
            else {
                return '0';
            }
        },
        { enabled: !!account }

    );

    return { contractBalanceQuery, userBalanceQuery }

};

export default useBalance;