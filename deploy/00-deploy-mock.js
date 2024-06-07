const {network} = require("hardhat")
const {developmentChain} = require("../helper-hardhat-config")
const {Contract} = require("ethers")
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    if (developmentChain.includes(network.name)) {
        log("local network detected! deploying mocks....")
        const mock = await deploy("MockAggregatorV2V3", {
            Contract: "MockAggregatorV2V3",
            from: deployer,
            args: [],
        })
        log("mocks deployed")
        log("----------------------------------------------------------------")
    }
}
module.exports.tags = ["all"]
