var AgreementFactory = artifacts.require("./AgreementFactory.sol");
var HashLib = artifacts.require("./HashLib.sol");

module.exports = function(deployer) {
  deployer.deploy(HashLib);
  deployer.link(HashLib, AgreementFactory);
  deployer.deploy(AgreementFactory);
};
