var FlexiTimeToken = artifacts.require("./FlexiTimeToken.sol");
var FlexiTimeAgreement = artifacts.require("./FlexiTimeAgreement.sol");
var FlexiTimeFactory = artifacts.require("./FlexiTimeFactory.sol");
var FlexiTimeTask = artifacts.require("./FlexiTimeTask.sol");
var HashLib = artifacts.require("./HashLib.sol");

module.exports = function(deployer) {

  deployer.deploy(HashLib);
  deployer.link(HashLib, FlexiTimeFactory);
  deployer.deploy(FlexiTimeFactory);

  // deployer.deploy(FlexiTimeTask);
  // deployer.link(FlexiTimeAgreement, FlexiTimeToken);
  // deployer.link(FlexiTimeTask, FlexiTimeToken);
  // deployer.deploy(FlexiTimeToken);


  // deployer.deploy([FlexiTimeAgreement, FlexiTimeFactory, FlexiTimeTask, FlexiTimeToken]);
  // deployer.deploy(FlexiTimeFactory);
  // deployer.deploy(FlexiTimeTask);
  // deployer.deploy(FlexiTimeToken);
};
