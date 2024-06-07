const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    await deployments.fixture(["all"])
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundme.target}`)
    console.log("Withdrawing from contract...")
    const transactionResponse = await fundme.withdraw()
    await transactionResponse.wait()
    console.log("Got it back!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
