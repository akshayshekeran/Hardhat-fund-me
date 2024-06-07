const {Contract} = require("ethers")
const {networkConfig, developmentChain} = require("../helper-hardhat-config")
const {network} = require("hardhat")
const {verify} = require("../utils/verify")

require("dotenv").config()

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethusdPricefeedaddress
    if (developmentChain.includes(network.name)) {
        const ethusdaggregator = await deployments.get("MockAggregatorV2V3")
        ethusdPricefeedaddress = ethusdaggregator.address
    } else {
        ethusdPricefeedaddress =
            networkConfig[chainId]["ethusdPricefeedaddress"]
        // console.log(ethusdPricefeedaddress)
    }
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethusdPricefeedaddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    log("Deployed successfully")
    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHER_SCAN_API_KEY
    ) {
        await verify(fundme.address, [ethusdPricefeedaddress])
    }
}
module.exports.tags = ["fundme", "all"]
