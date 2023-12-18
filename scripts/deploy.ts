const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

  // Get owner/deployer's wallet address
  const [owner] = await ethers.getSigners();

  // Get contract that we want to deploy
  const contractFactory = await ethers.getContractFactory("CurrencyConverter");

  // Deploy contract with the correct constructor arguments
  const contract = await contractFactory.deploy();

  // Wait for this transaction to be mined
  await contract.waitForDeployment();

  console.log("Contract deployed to address:", await contract.getAddress());

  // Get all token IDs of the owner
  let tokens = await contract.walletOfOwner(await owner.getAddress());
  console.log("Owner has tokens: ", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
