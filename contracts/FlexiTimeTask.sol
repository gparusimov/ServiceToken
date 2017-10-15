pragma solidity ^0.4.4;

import "./FlexiTimeToken.sol";

/* Tracks under escrow token usage per specific task */
contract FlexiTimeTask {

  enum States { Created, Settled, Refunded }

  States public state;
  FlexiTimeToken public token;

  modifier onlyCreated {
    require(state == States.Created);
    _;
  }

  function FlexiTimeTask() {
    token = FlexiTimeToken(msg.sender);
    state = States.Created;
  }

  /* Beneficiary is able to settle with issuer by transferring tokens out of escrow */
  function settle() onlyCreated {
    require(msg.sender == token.agreement().beneficiary());
    token.transfer(token.agreement().issuer(), token.balanceOf(this));
    state = States.Settled;
  }

  /* Issuer is able to refund tokens in escrow back to beneficiary */
  function refund() onlyCreated {
    require(msg.sender == token.agreement().issuer());
    token.transfer(token.agreement().beneficiary(), token.balanceOf(this));
    state = States.Refunded;
  }
}
