pragma solidity ^0.4.4;

import "./FlexiTimeAgreement.sol";

/* Used to create the FlexiTimeToken and acts as digital signiture for legal docs */
contract FlexiTimeFactory {
  FlexiTimeAgreement[] public agreements; // Stores the registry of agreements

  function createAgreement(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint _validFrom,
    uint _expiresEnd,
    address _issuer,
    address _beneficiary,
    address _judge
    ) returns (FlexiTimeAgreement agreementAddress) {

    FlexiTimeAgreement agreement = new FlexiTimeAgreement(
      _name, _symbol, _decimals, _totalSupply, _validFrom,
      _expiresEnd, _issuer, _beneficiary, _judge);

    agreements.push(agreement);
    return agreement;
  }
}
