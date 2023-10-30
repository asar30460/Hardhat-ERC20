async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DIDReg = await ethers.deployContract("EthereumDIDRegistry");

  console.log("EthereumDIDRegistry address:", await DIDReg.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
