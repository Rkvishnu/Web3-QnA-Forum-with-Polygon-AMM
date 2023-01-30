import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { makeBig } from '../../Front-end/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Amm', () => {
  let matic: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress;

  beforeEach(async () => {
    // the getSigners() method allows us to create mock users
    const [_owner, _user1, _user2] = await ethers.getSigners();
    owner = _owner;
    user1 = _user1;
  });

  beforeEach(async () => {
    // Deploy the Matic contract
    const Matic = await ethers.getContractFactory('Matic');
    matic = await Matic.deploy();
    await matic.deployed();
  })

  describe('Deployment', () => {
    it('should deploy the matic contract', async () => {
      console.log('matic address: ', matic.address);
      expect(await matic.totalSupply()).to.equal(makeBig(2000));
    })
  })
})