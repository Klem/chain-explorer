/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.28",
  // default settings, but
  // set explicitly for information
  networks: {
    hardhat: {
      chainId: 1337,
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 10000000,
      accounts: {
        count: 20, // Number of pre-funded accounts
        initialBalance: "10000000000000000000000", // 10,000 ETH in wei
      },
      forking: {
         url: `${process.env.ETH_TEST_RPC}`, // TODO make dynamic
         blockNumber: 8481149, // Pin to a specific block, enable caching and result consistency for testing
        enabled: true,
      }
    }
  }
};
