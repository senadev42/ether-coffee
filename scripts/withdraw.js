const hre = require('hardhat');
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

require("dotenv").config()
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

///Utility Functions

// Returns the Ether balance of a fake given address.
async function getBalance(provider, address) {
    //const balanceBigInt = await hre.ethers.provider.getBalance(address);
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
  }


//main part

async function main() {

    //get address and abi to be able to interact with it
    const contractAddress = CONTRACT_ADDRESS;
    const contractABI= abi.abi;

    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    //connect to the contract

    const buyCoffeeContract = new hre.ethers.Contract(contractAddress, contractABI, signer);
    const contractBalance = await getBalance(provider, buyCoffeeContract.address);

    console.log("Wallet Balance: ", await getBalance(provider, signer.address), "ETH");
    console.log("Contract Balance:", await getBalance(provider, buyCoffeeContract.address), "ETH");

      // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyCoffeeContract.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });