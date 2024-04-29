const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("----------------------------------------------------");
    log("Deploying MockV3Aggregator on development chains...");

    const mockV3Aggregator = await deploy("MockV3Aggregator", {
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      waitConfirmations: 1,
      log: true,
    });

    if (!mockV3Aggregator.newlyDeployed) {
      log(`MockV3Aggregator already deployed at ${mockV3Aggregator.address}`);
    } else {
      log(`MockV3Aggregator newly deployed at ${mockV3Aggregator.address}`);
    }
  }
  log("You should not deploy MockV3Aggregator on mainnet/testnet!!");
};

module.exports.tags = ["all", "mocks"];
