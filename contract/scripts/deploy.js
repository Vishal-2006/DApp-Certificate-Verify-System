const hre = require("hardhat");

async function main() {
  // 1. Tell Hardhat which contract we want to deploy
  // "AcademicSBT" must match the name of the class in your Solidity file
  const AcademicSBT = await hre.ethers.getContractFactory("AcademicSBT");

  console.log("Deploying contract... please wait...");

  // 2. Deploy it
  const sbt = await AcademicSBT.deploy();

  // 3. Wait for the transaction to be mined
  await sbt.waitForDeployment();

  // 4. Print the address (This is the most important part!)
  console.log("SBT Contract Deployed to:", sbt.target);
}

// Check for errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});