var FlexiTimeToken = artifacts.require("./FlexiTimeToken.sol");
var FlexiTimeAgreement = artifacts.require("./FlexiTimeAgreement.sol");
var FlexiTimeFactory = artifacts.require("./FlexiTimeFactory.sol");
var FlexiTimeTask = artifacts.require("./FlexiTimeTask.sol");
var HashLib = artifacts.require("./HashLib.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(FlexiTimeAgreement);
  deployer.deploy(FlexiTimeFactory);
  deployer.deploy(FlexiTimeTask);
  deployer.deploy(FlexiTimeToken,
    "FlexiTime Token AB001",
    "AB001",
    0,
    240,
    1507455290,
    1538991278,
    0xB1674191A88EC5CDD733E4240A81803105DC412D6C6708D53AB94FC248F4F553,
    "0x579DEf016752dd6227CdA2029b4C6AF6054b2712",
    "0xC52edCdea8d5458C7F3FC3e16D7CC454b6893508"
    );
  deployer.link(HashLib, FlexiTimeAgreement);
};
