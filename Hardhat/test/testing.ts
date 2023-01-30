import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('GoOverFlow', function () {
  let goOverFlow: Contract, owner: SignerWithAddress, otherAccount: SignerWithAddress;

  const deployContract = async () => {
    // Contracts are deployed using the first signer/account by default
    // but we can create multiple user accounts for testing
    const [_owner, _otherAccount] = await ethers.getSigners();

    // Make sure the string argument passed to getContractFactory matches
    // the exact name of your token contract!
    const GoOverFlow = await ethers.getContractFactory('GoOverFlow');
    goOverFlow = await GoOverFlow.deploy();
    await goOverFlow.deployed();

    // console.log()
    owner = _owner;
    otherAccount = _otherAccount;
  };

  //mining function
  const mint = async (user: SignerWithAddress, amount: number) => {
    // We mock different users with the `connect` method
    const tx = await goOverFlow.connect(user).mint(amount);
    await tx.wait();

  }

  beforeEach(async () => {
    await deployContract();
  });

  describe('Deployment', () => {
    it('Should deploy and return correct symbol', async () => {
      expect(await goOverFlow.symbol()).to.equal('GOFLOW');
    });
  });

  describe("Minting", () => {
    it("Should mint tokens to user", async () => {
      await mint(owner, 100);
      expect(await goOverFlow.balanceOf(owner.address)).to.equal(100);
    });
  });

  describe("Transfer", () => {
    it("Shoud transfer 100 tokens to another address", async () => {
      await mint(owner, 100);
      await goOverFlow.transfer(otherAccount.address, 100);//trnafer tokens to another address

      expect(await goOverFlow.balanceOf(owner.address)).to.equal(0);
      expect(await goOverFlow.balanceOf(otherAccount.address)).to.equal(100);
    });
  });


  describe("TransferFrom", () => {
    it("Should approve a spender to be able to transfer owner's tokens", async () => {
      await mint(owner, 100); // owner should start with 100 tokens
      expect(await goOverFlow.balanceOf(owner.address)).to.equal(100);

      // // first we gotta "approve before we can move"
      // // so the "spender" can access and transfer the owner's tokens!
      const approve = await goOverFlow.approve(otherAccount.address, 100);
      await approve.wait();
      // // use the connect method to connect to the otherAccount
      const transferFrom = await goOverFlow.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 100);
      await transferFrom.wait();
      // // the spender should now have transferred the 100 tokens to themselves
      expect(await goOverFlow.balanceOf(owner.address)).to.equal(0);
      expect(await goOverFlow.balanceOf(otherAccount.address)).to.equal(100);
    });


    it("Should not allow a spender to transfer more tokens than they have", async () => {
      await mint(owner, 100); // owner should start with 100 tokens
      expect(await goOverFlow.balanceOf(owner.address)).to.equal(100);

      // the approve method should throw an error 
      // if the user tries to approve more tokens than they have
      // NOTE: move `await` to the beginning of the expect statement
      // NOTE: the error message comes from our approve method's `require` statement
      await expect(goOverFlow.approve(otherAccount.address, 200)).to.be.revertedWith('insufficient balance for approval!');
    });
  });


});