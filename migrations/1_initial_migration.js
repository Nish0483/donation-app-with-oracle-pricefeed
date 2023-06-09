const Donation = artifacts.require("Donation");
const ChainlinkPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

module.exports = function(deployer) {
  deployer.deploy(Donation, ChainlinkPriceFeedAddress);
};
