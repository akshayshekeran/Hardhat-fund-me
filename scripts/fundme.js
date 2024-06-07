const {ethers, getNamedAccounts} = require("hardhat")

async function main() {
    const deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    const fundme = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundme.target}`)
    console.log("Funding contract...")
    const transactionResponse = await fundme.fund({
        value: ethers.parseEther("100"),
    })
    await transactionResponse.wait()
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
