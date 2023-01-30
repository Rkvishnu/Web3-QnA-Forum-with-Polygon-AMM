import { defaultUtils } from "@nextui-org/react/types/theme/common";
import { BigNumber } from "ethers";
import { useQuery } from "react-query";
import useForumContract from './contracts/useForumContract';

interface UserQuestionQuery {
    questionId?: BigNumber;
}

const useQuestions = ({ questionId }: UserQuestionQuery) => {
    const contract = useForumContract();


    //useQuery(key,function)
    //whatever the data comes from the functioon would be saved in this key
    const questionQuery = useQuery(
       //key
        ['question', questionId?.toNumber],
        

        //function-->wahever this function returns it will saved in the question key  above
        async () => {
            if (questionId) {
                return await contract.getQuestion(questionId)
            }
        },
        // / ensures questionId has a value before fetching
        { enabled: !!questionId }
    );


    const allQuestionsQuery = useQuery(
        ['questions'],
        async () => {
            return await contract.getAllQuestions();
        }
    );

    return { questionQuery, allQuestionsQuery }
}
export default useQuestions;
