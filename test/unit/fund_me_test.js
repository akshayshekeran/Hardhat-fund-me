const {assert, expect} = require("chai")
const {network, deployments, ethers, getNamedAccounts} = require("hardhat")
const {developmentChain} = require("../../helper-hardhat-config")
!developmentChain.includes(network.name)
    ? describe.skip
    : describe("fundme", async () => {
          let fundme
          let MockAggregatorV2V3
          let deployer
          const sendValue = "1000000000000000000"
          beforeEach(async () => {
              // const accounts = await ethers.getSigner()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundme = await ethers.getContract("FundMe", deployer)
              MockAggregatorV2V3 = await ethers.getContract(
                  "MockAggregatorV2V3",
                  deployer,
              )
          })
          // describe("Constructor",function(){
          //     it("sets the aggregator address correctly",async()=>{
          //         const response =await fundme.getPriceFeed()
          //         const add=MockAggregatorV2V3.address
          //         console.log(response)
          //         console.log("equals to")
          //         console.log(add)
          //         assert.equal(response,add)
          //     })

          // })
          describe("fund", function () {
              // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
              // could also do assert.fail
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundme.fund()).to.be.revertedWith(
                      "You need to spend more ETH!",
                  )
              })
              // we could be even more precise here by making sure exactly $50 works
              // but this is good enough for now
              it("Updates the amount funded data structure", async () => {
                  await fundme.fund({value: sendValue})
                  const response =
                      await fundme.getAddressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async () => {
                  await fundme.fund({value: sendValue})
                  const response = await fundme.getFunder(0)
                  assert.equal(response, deployer)
              })
          })
          describe("withdraw", function () {
              beforeEach(async () => {
                  await fundme.fund({value: sendValue})
              })

              it("withdraw eth from a single founder", async () => {
                  const ini_fundme_balance = await ethers.provider.getBalance(
                      fundme.target,
                  )
                  const ini_deployer_balance =
                      await ethers.provider.getBalance(deployer)
                  const transactionResponse = await fundme.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const {gasUsed, gasPrice} = transactionReceipt
                  const gasCost = gasPrice * gasUsed

                  const fin_fundme_balance =
                      await ethers.provider.getBalance(fundme)
                  const fin_deployer_balance =
                      await ethers.provider.getBalance(deployer)

                  assert.equal(fin_fundme_balance, 0)
                  assert.equal(
                      (ini_fundme_balance + ini_deployer_balance).toString(),
                      (fin_deployer_balance + BigInt(gasCost)).toString(),
                  )
              })
              it("is allows us to withdraw with multiple funders", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 10; i++) {
                      const fundMeConnectedContract = await fundme.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({value: sendValue})
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundme.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundme.withdraw()
                  // Let's comapre gas costs :)
                  // const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait()
                  const {gasUsed, gasPrice} = transactionReceipt
                  const withdrawGasCost = gasUsed * gasPrice
                  console.log(`GasCost: ${withdrawGasCost}`)
                  console.log(`GasUsed: ${gasUsed}`)
                  console.log(`GasPrice: ${gasPrice}`)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundme.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  // Assert
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (
                          endingDeployerBalance + BigInt(withdrawGasCost)
                      ).toString(),
                  )
                  // Make a getter for storage variables
                  await expect(fundme.getFunder(0)).to.be.reverted

                  for (i = 1; i < 10; i++) {
                      assert.equal(
                          await fundme.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundme.connect(
                      accounts[1],
                  )
                  await expect(
                      fundMeConnectedContract.withdraw(),
                  ).to.be.revertedWithCustomError(
                      fundMeConnectedContract,
                      "fundme__NotOwner",
                  )
              })
          })
      })
