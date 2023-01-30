import { Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';
import { makeBig } from '../../Front-end/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {
  // let's get a another SignerWithAddress to upvote a question
  const [owner, user1] = await ethers.getSigners();
  // these addresses should match Account #0 & #1 from our local node
  console.log('With each deployment to the localhost...');
  console.log('...these addresses will stay the same');
  console.log('owner address: ', owner.address);
  console.log('user1 address: ', user1.address, '\n');

  // deploy the contracts
  const Goflow: ContractFactory = await ethers.getContractFactory('Goflow');
  const goflow: Contract = await Goflow.deploy();
  console.log('...these addresses may change');
  console.log('goflow deployed to: ', goflow.address);
  const Forum: ContractFactory = await ethers.getContractFactory('Forum');
  // pass the GOFLOW token address to the Forum contract's constructor!
  const forum: Contract = await Forum.deploy(goflow.address);
  await forum.deployed();
  console.log('forum deployed to: ', forum.address);

  // Let's populate our app with some questions and answers.
  // We are posting as `owner` by default
  const qTx = await forum.postQuestion('Are you my fren? 🤗');
  await qTx.wait();

  // Let's post an answer to the question
  // Our first question has the id 0 which we pass as the first argument
  const answerTx = await forum.postAnswer(0, '1st answer');
  await answerTx.wait();

  const answerTx2 = await forum.postAnswer(0, '2nd answer');
  await answerTx2.wait();

  // What a nice answer 🤝 🤗
  const answerTx3 = await forum.postAnswer(0, 'Yes, I am ur fren! 👊');
  await answerTx3.wait();

  // Connect to `user1` in order to mint, approve, and upvote an answer
  // We need to parse the token amount into a BigNumber of the correct unit
  const mintTx = await goflow.connect(user1).mint(makeBig('1000'));
  await mintTx.wait();

  // "approve before someone else can move" our tokens with the transferFrom method
  const approve = await goflow.connect(user1).approve(forum.address, makeBig('1000'));
  await approve.wait();

  // upvote answer with id 2, 'Yes, I am ur fren! 👊'
  const upvote1 = await forum.connect(user1).upvoteAnswer(2);
  await upvote1.wait();

  /**
   * PART 2: Add AMM contracts and liquidity
   */
  const Matic = await ethers.getContractFactory('Matic');
  const matic = await Matic.deploy();
  await matic.deployed();

  console.log('matic deployed to: ', matic.address);
  const AMM = await ethers.getContractFactory('AMM');
  const amm = await AMM.deploy(matic.address, goflow.address);
  await amm.deployed();
  console.log('AMM deployed to: ', amm.address);

  // mint more for AMM liquidity
  await goflow.mint(makeBig(1000));
  await goflow.connect(user1).mint(makeBig(1000));
  // Owner mints 2000 matic ond deploy, transfers 1000 from owner to user1
  await matic.transfer(user1.address, makeBig(1000));

  const provideLiquidity = async (user: SignerWithAddress, allowAmount = 1_000, provideAmount = 100) => {
    const allow = makeBig(allowAmount); //1000
    const provide = makeBig(provideAmount); //100

    const approve = await goflow.connect(user).approve(amm.address, allow);
    await approve.wait();
    const approve2 = await matic.connect(user).approve(amm.address, allow);
    await approve2.wait();

    const liquidity = await amm.connect(user).provide(provide, provide);
    await liquidity.wait();
  };

  await provideLiquidity(owner); // owner approves AMM to transfer 1000 of each token & provides 100 of each token to the AMM contract
  await provideLiquidity(user1); // user1
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });