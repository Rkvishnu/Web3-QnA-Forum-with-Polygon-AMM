import type { BigNumber } from 'ethers';
import { useQuery } from 'react-query';
import useForumContract from './contracts/useForumContract';


interface UseAnswersQuery {
    questionId: BigNumber;
  }

  const useAnswers=({questionId}:UseAnswersQuery)=>{
    const contract= useForumContract();

    return useQuery(
        ['answers',questionId.toNumber()],
        async()=>{
            return await contract.getAnswers(questionId);
        },

        // / ensures questionId has a value before fetching
        {enabled :!!questionId}
    );
  };

  export default useAnswers;