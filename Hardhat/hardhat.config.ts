import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.0',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/0Jtr0h75aDWQqw-ryXTK36gm_HYbPT0k',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;