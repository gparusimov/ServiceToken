var AgreementFactory = artifacts.require("./AgreementFactory.sol");
var ServiceAgreement = artifacts.require("./ServiceAgreement.sol");

contract('AgreementFactory', function(accounts) {
  issuer = accounts[0];
  beneficiary = accounts[1];
  totalSupply = 240;
  validFrom = Math.round(new Date() / 1000);
  expiresEnd = validFrom + 60;

  it("should agree to 240 tokens", function() {
    return AgreementFactory.deployed().then(function(factory) {
      factory.createAgreement(
        "ServiceToken", "ST0", 0, totalSupply, validFrom, expiresEnd, issuer, beneficiary
      );
      return factory;
    }).then(function(factory) {
      return factory.agreements.call(0);
    }).then(function(agreementAddress) {
      return ServiceAgreement.at(agreementAddress);
    }).then(function(agreement) {
      return agreement.totalSupply.call();
    }).then(function(_totalSupply) {
      console.log("totalSupply: ", _totalSupply.toNumber());
      assert.equal(_totalSupply.toNumber(), totalSupply, "Issued tokens should be equal to 240");
    }).catch(function(e) {
      console.log(e);
    });
  });
});
