pragma solidity ^0.4.4;

import "./FlexiTimeToken.sol";
import "./FlexiTimeFactory.sol";
import "./HashLib.sol";

/* Created by factory in order to sign agreement and generate token contract */
contract FlexiTimeAgreement {

  enum States { Created, Proposed, Withdrawn, Accepted, Rejected }

  States public state;
  FlexiTimeToken public token; // link to the created token
  FlexiTimeFactory public factory; // can be used to validate that contract is recognised by factory

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  uint public validFrom;
  uint public expiresEnd;
  bytes32 public contentHash;
  address public issuer;
  address public beneficiary;

  modifier onlyIssuer {
    require(msg.sender == issuer);
    _;
  }

  modifier onlyBeneficiary {
    require(msg.sender == beneficiary);
    _;
  }

  modifier onlyProposed {
    require(state == States.Proposed);
    _;
  }

  modifier onlyCreated {
    require(state == States.Created);
    _;
  }

  function FlexiTimeAgreement(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint _validFrom,
    uint _expiresEnd,
    address _issuer,
    address _beneficiary
    ) {

      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      totalSupply = _totalSupply;
      validFrom = _validFrom;
      expiresEnd = _expiresEnd;
      issuer = _issuer;
      beneficiary = _beneficiary;

      factory = FlexiTimeFactory(msg.sender);
      state = States.Created;
  }

  /* submitted by the issuer as the first signiture including docId of legal doc */
  function propose(bytes32 hashedHash) onlyIssuer onlyCreated {
    contentHash = hashedHash;
    state = States.Proposed;
  }

  /* allow issuer to withdraw aggreement proposal before it is accepted */
  function withdraw() onlyIssuer onlyProposed {
    state = States.Withdrawn;
  }

  /* beneficiary is able to agree to agreement proposal i.e. sign it, passing docId ass safety check*/
  function accept(bytes32 _contentHash) onlyBeneficiary onlyProposed returns (FlexiTimeToken _token) {
    require(HashLib.matches(contentHash, _contentHash)); // matches double hash in agreement to single hash in token

    contentHash = _contentHash;
    token = new FlexiTimeToken();
    state = States.Accepted;

    return token;
  }

  function reject() onlyBeneficiary onlyProposed {
    state = States.Rejected;
  }
}
