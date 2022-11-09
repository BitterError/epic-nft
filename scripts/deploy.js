const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const gasPrice = await nftContractFactory.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await nftContractFactory.signer.estimateGas(
    nftContractFactory.getDeployTransaction(),
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await nftContractFactory.signer.getBalance();
  console.log(`Deployer balance:  ${hre.ethers.utils.formatEther(deployerBalance)}`);
  console.log(`Deployment price:  ${hre.ethers.utils.formatEther(deploymentPrice)}`);
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${hre.ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance),
      )}`,
    );
  }

  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.makeAnEpicNFT()
  await txn.wait()
  console.log("Minted NFT #1")
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();