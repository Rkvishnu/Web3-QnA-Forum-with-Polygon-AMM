import * as wagmi from 'wagmi';
import { useProvider,useSigner } from 'wagmi';
import { WagmiConfig } from 'wagmi'
import { BigNumber, ethers } from "ethers";
// Import our contract ABI (a json representation of our contract's public interface).
// The hardhat compiler writes this file to artifacts every time we run npx hardhat.

import ForumContract from "../../lib/contracts/Forum.sol/Forum.json";


export enum ForumEvent {
    QuestionAdded = 'QuestionAdded',
    AnswerAdded = 'AnswerAdded',
    AnswerUpvoted = 'AnswerUpvoted',
  }

  
export interface Question {
    questionId: BigNumber;
    message: string;
    creatorAddress: string;
    timestamp: BigNumber;
}

export interface Answer {
    answerId: BigNumber;
    questionId: BigNumber;
    creatorAddress: string;
    message: string;
    timestamp: BigNumber;
    upvotes: BigNumber;
}

const useForumContract = () => {

    const provider = useProvider(); // wallet provider
    const {data:signer}=useSigner();
    // const provider = new ethers.providers.JsonRpcProvider();

    //taking contract instance using wagmi 
    const contract = wagmi.useContract({
        addressOrName: '0x7cF7922CA1bd3663eF588537462350cbB146d0bD',
        contractInterface: ForumContract.abi,
        signerOrProvider: signer||provider

    })

    //get an specific question
    const getQuestion = async (questionId: BigNumber): Promise<Question> => {
        return { ...await contract.questions(questionId) };
    }


    //get AllQuestions
    const getAllQuestions = async (): Promise<Question[]> => {
        const qArray = await contract.getQuestions();

        // When we return a struct from our contract we notice that
        // ethers parses it as an array with both integer indexes AND string keys 🤔.
        //  That’s why we use the spread operator ... to convert the array to an object, 

        return qArray.map((q: Question) => ({ ...q }));
    }



    //get AllAnswers of a particular question
    const getAnswers = async (questionId: BigNumber): Promise<Answer[]> => {
        const answerIds: BigNumber[] = await contract.getAnswersPerQuestions(questionId);

        // We map this array and call contract.answers(answerId)  for
        // each ID to return each Answer Struct from our answers array state variable:

        const mappedAnswers = answerIds.map((answerId: BigNumber) => contract.answers(answerId));
        const allAnswers = await Promise.all(mappedAnswers);

        // When we return a struct from our contract we notice that
        // ethers parses it as an array with both integer indexes AND string keys 🤔.
        //  That’s why we use the spread operator ... to convert the array to an object, 

        return allAnswers.map((a) => {
            return { ...a };
        });
    };

    const getUpvotes = async (answerId: BigNumber): Promise<BigNumber> => {
        return await contract.getUpvotes(answerId);
    }

    // in typescript if we don't want to return anything then write void inside the generics
    const postQuestion = async (message: string): Promise<void> => {
        const qPost = await contract.postQuestion(message);
        await qPost.wait();
    }

    const postAnswer = async (questionId: BigNumber, message: string): Promise<void> => {
        const AnsPost = await contract.postAnswer(questionId, message);
        await AnsPost.wait();
    };

    const upvoteAnswer = async (answerId: BigNumber): Promise<void> => {
        const upAns = await contract.upvoteAnswer(answerId);
        await upAns.wait();
    }


    return {
        contract,
        chainId: contract.provider.network?.chainId,
        getQuestion,
        getAllQuestions,
        getAnswers,
        getUpvotes,
        postQuestion,
        postAnswer,
        upvoteAnswer

    }
}

export default useForumContract;