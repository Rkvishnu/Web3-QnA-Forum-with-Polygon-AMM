import type { BigNumber } from 'ethers';
import { useMutation } from 'react-query';
import useForumContract from './contracts/useForumContract';


interface UseQuestionPayload{
    message:string;
questionId:BigNumber;
}

const useAddAnswer=()=>{
    const contract= useForumContract();

  // mutations are typically used to create/update/delete data or perform server side-effects
    return useMutation(async({questionId,message}:UseQuestionPayload)=>{
        await contract.postAnswer(questionId,message);
    })
}
export default useAddAnswer;