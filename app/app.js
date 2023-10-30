// Import everything
const { ethers, Contract } = require("ethers");

const getBasicInfo = async (provider, signer) => {
  console.log("============Basic Info============");

  const blockNumber = await provider.getBlockNumber();
  console.log("Signer:", signer["address"]);
  console.log("BlockNumber:", blockNumber);

  // Function "getBalance()" returns unit of wei
  // We can convert wei into ether by calling function "formatEther"
  const totalSupply = await provider.getBalance(signer["address"]);
  const formatTotalSupply = ethers.formatEther(totalSupply);
  console.log("Ethers of signer:", formatTotalSupply, "ETH");

  console.log("============End Func============\n");
};

const readOnlyMethods = async (provider) => {
  console.log("============Read-only Method============");

  // The contract ABI (fragments we care about)
  abi = ["function balanceOf(address account) view returns (uint)"];

  // Create a contract; connected to a Provider, so it may
  // only access read-only methods (like view and pure)
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const contract = new Contract(contractAddress, abi, provider);

  // Read the token balance for an account
  const ownerAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  balance = await contract.balanceOf(ownerAddress);
  console.log("Balance:", balance, "MHT");

  console.log("============End Func============\n");
};

const StateChangingMethods = async (signer) => {
  console.log("============State-changing Methods============");

  // The contract ABI (fragments we care about)
  abi = ["function transfer(address to, uint amount)"];

  // Connected to a Signer; can make state changing transactions,
  // which will cost the account ether
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const contract = new Contract(contractAddress, abi, signer);

  // Send the transaction
  const toAddress = "0xfabb0ac9d68b0b445fb7357272ff202c5651694a";
  const amount = 500000;
  const tx = await contract.transfer(toAddress, amount);
  // Currently the transaction has been sent to the mempool,
  // but has not yet been included.
  // So, we wait for the transaction to be included.
  await tx.wait();

  console.log("============End Func============\n");
};

const main = async () => {
  /*** IMPORTANT!!! ********************************
  A Provider is a "read-only!!!" connection to the blockchain,
  which allows querying the blockchain state,
  such as account, block or transaction details,
  querying event logs or evaluating read-only code using call.
  *** read-only access to the Ethereum network (a Provider)
  *** authenticated write access backed by a private key (a Signer) */
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner();

  await getBasicInfo(provider, signer);
  await readOnlyMethods(provider);
  // await StateChangingMethods(signer);

  const http = require("http");
  const hostname = "127.0.0.1";
  const port = 3000;
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Ether Test");
  });
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

module.exports = main();