pragma solidity ^0.4.4;

import "./FlexiTimeTask.sol";

/* Tracks tokens isssued */
contract FlexiTimeToken {
  /* ECR20 specifics */
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  mapping (address => uint256) balances; // This creates an array with all balances

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  /* FTT specifics */
  uint public validFrom; // Contract start timestamp in seconds from epoch, example is 2017-Oct-08
  uint public expiresEnd; // Contract end timestamp in sconds from epoch, example is 2018-Oct-08
  bytes32 public docId; // This is a legal agreement document hash, example hashes bitcoin.pdf whitepaper
  address public issuer; // Token issuer address
  address public beneficiary; // Token issuer address
  address public judge; // Judge address who can settle at refund escrowed tokens under dispute

  FlexiTimeTask[] public tasks; // Stores the registry of creating task contracts

  /* Token constructor */
  function FlexiTimeToken(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _totalSupply,
    uint _validFrom,
    uint _expiresEnd,
    bytes32 _docId,
    address _issuer,
    address _beneficiary,
    address _judge
    ){
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    totalSupply = _totalSupply;
    validFrom = _validFrom;
    expiresEnd = _expiresEnd;
    docId = _docId;
    issuer = _issuer;
    judge = _judge;

    balances[_beneficiary] = _totalSupply; // Assign all tokens to issuer
  }

  /* Returns account balance */
  function balanceOf(address _addr) constant returns (uint256 balance) {
    if ((validFrom < now) && (now > expiresEnd)) {
    /*if ((now() < validFrom) ||  ) || (_now > expiresEnd)) {*/
      return 0; // return 0 if current data is less than contract start or greate than comtract end
    } else {
      return balances[_addr]; // otherwise return the balance as is
    }
  }

  /* Create a new task where tokens can be sent into escrow */
  function createTask(bytes32 _docId) returns (FlexiTimeTask taskAddress) {
    /*require(msg.sender == beneficiary);*/
    FlexiTimeTask task = new FlexiTimeTask(_docId, issuer, msg.sender);
    tasks.push(task);
    return task;
  }

  /* Send coins */
  function transfer(address _to, uint256 _value) {
    require(balances[msg.sender] >= _value);           // Check if the sender has enough
    require(balances[_to] + _value >= balances[_to]);  // Check for overflows
    require(now <= expiresEnd);                   // Check if contract has expired
    balances[msg.sender] -= _value;                    // Subtract from the sender
    balances[_to] += _value;                           // Add the same to the recipient
  }
}
