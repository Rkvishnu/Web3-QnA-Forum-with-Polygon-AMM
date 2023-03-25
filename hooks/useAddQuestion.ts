import { useMutation } from 'react-query';
import useForumContract from './contracts/useForumContract';

interface UseAddQuestionPayload {
  message: string;
}

const useAddQuestion = () => {
  const contract = useForumContract();
  // mutations are typically used to create/update/delete data or perform server side-effects
  return useMutation(async ({ message }: UseAddQuestionPayload) => {
    await contract.postQuestion(message);
  });
};

export default useAddQuestion;