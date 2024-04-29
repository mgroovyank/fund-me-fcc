const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let priceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const priceFeedAggregator = await deployments.get("MockV3Aggregator");
    priceFeedAddress = priceFeedAggregator.address;
  } else {
    priceFeedAddress = networkConfig[chainId].ethToUSDPriceFeed;
  }

  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");

  const args = [priceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
    log: true,
  });

  if (!fundMe.newlyDeployed) {
    log(`FundMe already deployed at ${fundMe.address}`);
  } else {
    log(`FundMe newly deployed at ${fundMe.address}`);
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
};

module.exports.tags = ["all", "fundme"];
