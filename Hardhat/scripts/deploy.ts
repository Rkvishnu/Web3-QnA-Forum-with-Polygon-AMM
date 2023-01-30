import { GoOverFlow } from './../typechain-types/contracts/GoOverFlow';
import { Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';
import { makeBig } from '../../Front-end/lib/utils';

async function main() {

  // let's get a another SignerWithAddress to upvote a question
  const [owner, user1] = await ethers.getSigners();
  // these addresses should match Account #0 & #1 from our local node
  console.log('With each deployment to the localhost...');
  console.log('...these addresses will stay the same');
  console.log('owner address: ', owner.address);
  console.log('user1 address: ', user1.address, '\n');

  // deploy the contracts
  const GoOverFlow: ContractFactory = await ethers.getContractFactory('GoOverFlow');
  const goOverFLow: Contract = await GoOverFlow.deploy();
  console.log('...these addresses may change');
  console.log('goOverflow deployed to: ', goOverFLow.address);
  const Forum: ContractFactory = await ethers.getContractFactory('Forum');
  // pass the GOFLOW token address to the Forum contract's constructor!
  const forum: Contract = await Forum.deploy(goOverFLow.address);
  await forum.deployed();
  console.log('forum deployed to: ', forum.address);

  // Let's populate our app with some questions and answers.
  // We are posting as `owner` by default
  const qTx = await forum.postQuestion('Are you my fren? 🤗');
  await qTx.wait();

  // Let's post an answer to the question
  // Our first question has the id 0 which we pass as the first argument
  const answerTx = await forum.postAnswer(0, 'this is 1st answer');
  await answerTx.wait();

  const answerTx2 = await forum.postAnswer(0, ' this is 2nd answer');
  await answerTx2.wait();

 
  const answerTx3 = await forum.postAnswer(0, 'Yes, I am ur fren! 👊');
  await answerTx3.wait();

  // Connect to `user1` in order to mint, approve, and upvote an answer
  // We need to parse the token amount into a BigNumber of the correct unit
  const mintTx = await goOverFLow.connect(user1).mint(makeBig('1000')); 
  await mintTx.wait();

  // "approve before someone else can move" our tokens with the transferFrom method
  const approve = await goOverFLow.connect(user1).approve(forum.address, makeBig('1000'));
  await approve.wait();

  // upvote answer with id 2, 'Yes, I am ur fren! 👊'
  const upvote1 = await forum.connect(user1).upvoteAnswer(2);
  await upvote1.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });