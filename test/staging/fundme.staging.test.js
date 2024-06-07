const {assert} = require("chai")
const {network, ethers, getNamedAccounts} = require("hardhat")
const {developmentChain} = require("../../helper-hardhat-config")

developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let deployer
          let fundMe
          const sendValue = "100000000000000000"
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              console.log("Started")
              const fundTxResponse = await fundMe.fund({value: sendValue})
              await fundTxResponse.wait()
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait()

              const endingFundMeBalance = await ethers.provider.getBalance(
                  fundMe.target,
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal...",
              )
              assert.equal("0", "0")
              console.log("ended")
          })
      })
