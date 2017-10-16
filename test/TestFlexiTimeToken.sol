pragma solidity ^0.4.4;

// testrpc --mnemonic "nose snow exhibit begin street waste grace build clown fringe glare helmet"

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FlexiTimeToken.sol";

contract TestFlexiTimeToken {
  /*address public beneficiary = 0xC52edCdea8d5458C7F3FC3e16D7CC454b6893508;

  function testUnexpiredBalance() {
    FlexiTimeToken ftt = FlexiTimeToken(DeployedAddresses.FlexiTimeToken());

    uint unExpiredEpoch = 1507455300;
    ftt.setEpochNow(unExpiredEpoch);
    Assert.equal(ftt.epochNow(), unExpiredEpoch, "Time now should be 1507455300");

    uint totalSupply = 240;
    Assert.equal(ftt.balanceOf(beneficiary), totalSupply, "Beneficiary should have 240 FlexiTime tokens initially");
  }

  function testExpiredBalance() {
    FlexiTimeToken ftt = FlexiTimeToken(DeployedAddresses.FlexiTimeToken());

    uint expiredEpoch = 1538991300;
    ftt.setEpochNow(expiredEpoch);
    Assert.equal(ftt.epochNow(), expiredEpoch, "Time now should be 1538991300");

    uint totalSupply = 0;
    Assert.equal(ftt.balanceOf(beneficiary), totalSupply, "Beneficiary should have 0 FlexiTime tokens initially");
  }*/
}
