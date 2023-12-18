import { HardhatUserConfig } from "hardhat/config";
require("dotenv").config();
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
const { ALCHEMY_HTTPS_URL, METAMASK_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.3",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: ALCHEMY_HTTPS_URL,
      accounts: [METAMASK_PRIVATE_KEY],
    },
  }
};

export default config;
