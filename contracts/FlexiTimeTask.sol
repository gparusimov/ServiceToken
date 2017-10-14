pragma solidity ^0.4.4;

import "./FlexiTimeToken.sol";

/* Tracks under escrow token usage per specific task */
contract FlexiTimeTask {
  FlexiTimeToken public ftt;
  address public issuer; // Token issuer address
  address public beneficiary; // Token owner or beneficiary
  bytes32 public docId;

  function FlexiTimeTask(bytes32 _docId, address _issuer, address _beneficiary) {
    ftt = FlexiTimeToken(msg.sender);
    issuer = _issuer;
    beneficiary = _beneficiary;
    docId = _docId;
  }

  /* Beneficiary is able to settle with issuer by transferring tokens out of escrow */
  function settle(uint256 _value) {
    require(msg.sender == beneficiary);
    ftt.transfer(issuer, _value);
  }

  /* Issuer is able to refund tokens in escrow back to beneficiary */
  function refund(uint256 _value) {
    require(msg.sender == issuer);
    ftt.transfer(beneficiary, _value);
  }
}
