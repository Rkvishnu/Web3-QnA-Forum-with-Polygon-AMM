// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Forum {
    struct Question {
        uint questionId;
        string message;
        address creatorAddress;
        uint timestamp;
    }

    struct Answer {
        uint answerId;
        uint questionId;
        string message;
        address creatorAddress;
        uint timestamp;
        uint upvotes;
    }

    Question[] public questions;
    Answer[] public answers;

    //keeps track of how many answer is on a question
    mapping(uint => uint[]) public answersPerQuestion;
    // Keeps track of which users have upvoted an answer
    // We use this to prevent a user from upvoting more than once
    //answerId-->userAddress-->true/false
    mapping(uint => mapping(address => bool)) public upvoters;
    // Keeps track of how many upvotes the user has given
    // This could be used to reward "SUPER TIPPERS"
    mapping(address => uint) public usersUpvoteCount;

    //events
    event QuestionAdded(Question question);
    event AnswerAdded(Answer answer);
    event AnswerUpvoted(Answer answer);

    // Use the IERC20 interface as the variable's type.
    // We make it immutable so that it can be assigned
    // at constuction time but cannot be modified later
    IERC20 public immutable GoOverFlow;
    // Internal variable for helping with token math
    uint constant decimals = 18;

    // It's better if we define the tip and participation amount as
    // state variables rather than within the function.
    // Also, don't forget we can't use floating-point numbers in solidity
    uint amountToPay = 1 * 10 ** decimals;
    uint amountToParticipate = 10 * 10 ** decimals;

    constructor(address _tokenAddress) {
        GoOverFlow = IERC20(_tokenAddress);
    }

    // modifiers
    modifier answerExists(uint _answerId) {
        require(answers.length >= _answerId, "Answer does not exist!");
        _;
    }

    function postQuestion(string calldata _message) external {
        uint questionCounter = questions.length;

        //inerst question details
        Question memory question = Question({
            questionId: questionCounter,
            message: _message,
            creatorAddress: msg.sender,
            timestamp: block.timestamp
        });

        //push into questios array
        questions.push(question);
    }

    function postAnswer(uint _questionId, string calldata _message) external {
        uint answerCounter = answers.length;
        Answer memory answer = Answer({
            answerId: answerCounter,
            questionId: _questionId,
            creatorAddress: msg.sender,
            message: _message,
            timestamp: block.timestamp,
            upvotes: 0
        });

        // we use an answer array and an answersPerQuestion mapping to store answerIds for each question.
        // This makes it easier for us to fetch the answers based on a questionId

        answers.push(answer);
        answersPerQuestion[_questionId].push(answerCounter);
        emit AnswerAdded(answer);
    }

    function upvoteAnswer(uint _answerId) external answerExists(_answerId) {
        require(answers.length >= _answerId, "Answer does not exists");
        require(
            upvoters[_answerId][msg.sender] != true,
            "User already upvoted this answer!"
        );
        require(
            answers[_answerId].creatorAddress != msg.sender,
            "Cannot upvote own answer!"
        );
        require(
            GoOverFlow.balanceOf(msg.sender) >= amountToPay,
            "User has insufficient balance!"
        );
        require(
            GoOverFlow.allowance(msg.sender, address(this)) >= amountToPay,
            "Account did not approve token succesfully!"
        );

        //pull the currentANswer
        Answer storage currentAnswer = answers[_answerId];
        bool sent;
        //for getting paid for your answer you need to have atleast 10 goOverFlow tokens
        //else it would be sent to contract address itself
        if (
            GoOverFlow.balanceOf(currentAnswer.creatorAddress) >=
            amountToParticipate
        ) {
            sent = GoOverFlow.transferFrom(
                msg.sender,
                currentAnswer.creatorAddress,
                amountToPay
            );
        } else {
            sent = GoOverFlow.transferFrom(
                msg.sender,
                address(this),
                amountToPay
            );
        }

        require(sent, "Token transfer is failed!");
        currentAnswer.upvotes++;
        emit AnswerUpvoted(currentAnswer);
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }

    function getAnswersPerQuestion(
        uint _questionId
    ) public view returns (uint[] memory) {
        return answersPerQuestion[_questionId];
    }

    //get number of upvotes on any question
    function getUpvotes(
        uint _answerId
    ) external view answerExists(_answerId) returns (uint) {
        return answers[_answerId].upvotes;
    }
}
