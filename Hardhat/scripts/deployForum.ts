import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { makeBig } from "../../Front-end/lib/utils";

async function main() {
  // deploy the contracts
  const Goflow: ContractFactory = await ethers.getContractFactory("Goflow");
  const goflow: Contract = await Goflow.deploy();
  const Forum: ContractFactory = await ethers.getContractFactory("Forum");
  // pass the GOFLOW token address to the Forum contract's constructor!
  const forum: Contract = await Forum.deploy(goflow.address);
  await forum.deployed();
  console.log("goflow deployed to: ", goflow.address);
  console.log("forum deployed to: ", forum.address);

  
  // Let's populate our app with some questions and answers.
  // We are posting with our wallet address by default
  const qTx = await forum.postQuestion("Are you my fren? 🤗");
  await qTx.wait();

  // What a nice answer 🤝 🤗
  const answerTx3 = await forum.postAnswer(0, "Yes, I am ur fren! 👊");
  await answerTx3.wait();

  /**
   * PART 2: Add AMM contracts and liquidity
   */
  const Matic = await ethers.getContractFactory("Matic");
  const matic = await Matic.deploy();
  await matic.deployed();

  console.log("matic deployed to: ", matic.address);
  const AMM = await ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(matic.address, goflow.address);
  await amm.deployed();
  console.log("AMM deployed to: ", amm.address);

  // mint more for AMM liquidity
  const mint = await goflow.mint(makeBig(1000));
  await mint.wait();

  const approve = await goflow.approve(amm.address, makeBig(1_000));
  await approve.wait();
  const approve2 = await matic.approve(amm.address, makeBig(1_000));
  await approve2.wait();

  const liquidity = await amm.provide(makeBig(100), makeBig(100));
  await liquidity.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
