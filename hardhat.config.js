require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
require("hardhat-gas-reporter")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
            {
                version: "0.8.8",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 2,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    etherscan: {
        apiKey: process.env.ETHER_SCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "INR",
        outputFile: "gas-reporter.txt",
        noColors: true,
        coinmarketcap: process.env.COIN_MARKET_API,
        token: "ETH",
    },
}
