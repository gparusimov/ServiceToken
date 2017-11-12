pragma solidity ^0.4.4;

import "./FlexiTimeAgreement.sol";

/* Used to create the FlexiTimeToken and acts as digital signiture for legal docs */
contract FlexiTimeFactory {
  event Agreement(FlexiTimeAgreement agreement, address indexed creator, address indexed issuer, address indexed beneficiary);

  FlexiTimeAgreement[] public agreements; // Stores the registry of agreements

  function createAgreement(
    string name,
    string symbol,
    uint8 decimals,
    uint256 totalSupply,
    uint validFrom,
    uint expiresEnd,
    address issuer,
    address beneficiary,
    uint256 price
    ) {

    FlexiTimeAgreement agreement = new FlexiTimeAgreement(
      name, symbol, decimals, totalSupply, validFrom,
      expiresEnd, issuer, beneficiary, price);

    agreements.push(agreement);
    Agreement(agreement, msg.sender, issuer, beneficiary);
  }

  function getAgreements() returns (FlexiTimeAgreement[] _agreements) {
    return agreements;
  }
}
