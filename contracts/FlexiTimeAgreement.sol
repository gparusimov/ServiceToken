pragma solidity ^0.4.4;

import "./FlexiTimeToken.sol";
import "./HashLib.sol";

/* Created by factory in order to sign agreement and generate token contract */
contract FlexiTimeAgreement {

  enum States { Created, Proposed, Withdrawn, Accepted, Rejected, Repealed, Replaced }

  States public currentState;
  States public proposedState;
  address public proposalApprover;
  // TODO: also consider how to model when you want cancel a contract, or point to a new updated one

  bytes32 public docId;
  FlexiTimeToken public token;

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
  uint public validFrom;
  uint public expiresEnd;
  address public issuer;
  address public beneficiary;
  address public judge;

  function FlexiTimeAgreement(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint _validFrom,
    uint _expiresEnd,
    address _issuer,
    address _beneficiary,
    address _judge
    ) {

      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      totalSupply = _totalSupply;
      validFrom = _validFrom;
      expiresEnd = _expiresEnd;
      issuer = _issuer;
      beneficiary = _beneficiary;
      judge = _judge;

      currentState = States.Created;
  }

  /* submitted by the issuer as the first signiture including docId of legal doc */
  function propose(bytes32 _docId) {
    require(currentState == States.Created);
    require(msg.sender == issuer);

    docId = _docId;
    currentState = States.Proposed;
  }

  /* allow issuer to withdraw aggreement proposal before it is accepted */
  function withdraw() {
    require(currentState == States.Proposed);
    require(msg.sender == issuer);

    currentState = States.Withdrawn;
  }

  /* beneficiary is able to agree to agreement proposal i.e. sign it, passing docId ass safety check*/
  function accept(bytes32 _docId) returns (FlexiTimeToken _token) {
    require(currentState == States.Proposed);
    require(msg.sender == beneficiary);
    require(HashLib.matches(docId, _docId));

    currentState = States.Accepted;

    token = new FlexiTimeToken(
      name, symbol, decimals, totalSupply, validFrom,
      expiresEnd, docId, issuer, beneficiary, judge);

    return token;
  }

  function reject() {
    require(currentState == States.Proposed);
    require(msg.sender == beneficiary);

    currentState = States.Rejected;
  }

  /*function repealRequested();
  function replaceRequested();*/
}
