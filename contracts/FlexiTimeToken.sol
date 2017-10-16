pragma solidity ^0.4.4;

import "./FlexiTimeTask.sol";
import "./FlexiTimeAgreement.sol";

/* Tracks tokens isssued */
contract FlexiTimeToken {
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Task(FlexiTimeTask task);

  FlexiTimeAgreement public agreement; // Backlink to agreement that created the token
  mapping (address => uint256) balances; // This creates an array with all balances
  FlexiTimeTask[] public tasks; // Stores the registry of creating task contracts

  /* Token constructor */
  function FlexiTimeToken() {
    agreement = FlexiTimeAgreement(msg.sender); // Set backlink
    balances[agreement.beneficiary()] = agreement.totalSupply(); // Assign all tokens to issuer
  }

  /* Returns account balance */
  function balanceOf(address _addr) constant returns (uint256 balance) {
    if ((agreement.validFrom() < now) && (now > agreement.expiresEnd())) {
      return 0; // return 0 if current data is less than contract start or greate than comtract end
    } else {
      return balances[_addr]; // otherwise return the balance as is
    }
  }

  /* Create a new task where tokens can be sent into escrow */
  function createTask() {
    FlexiTimeTask task = new FlexiTimeTask();
    tasks.push(task);
    Task(task);
  }

  /* Send coins */
  function transfer(address _to, uint256 _value) {
    require(balances[msg.sender] >= _value);           // Check if the sender has enough
    require(balances[_to] + _value >= balances[_to]);  // Check for overflows
    require(now > agreement.validFrom());              // Check if contract has started
    require(now < agreement.expiresEnd());             // Check if contract has expired
    balances[msg.sender] -= _value;                    // Subtract from the sender
    balances[_to] += _value;                           // Add the same to the recipient
    Transfer(msg.sender, _to, _value);
  }
}
