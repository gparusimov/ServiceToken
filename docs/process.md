Based on the above example, the analyst is the issuer of the token, and the client is the beneficiary. Here is a high level process overview:

1. The issuer uses the [factory](AgreementFactory) contract's createAgreement transaction to create a new [agreement](ServiceAgreement) smart contract and an accompanying legal contract based on [this](Consulting-Agreement-Template) template.
1. The issuer and beneficiary sign the agreement, see [agreement](ServiceAgreement), which creates a new [token](ServiceToken) contract.
1. The beneficiary starts to redeem tokens by using the [token](ServiceToken) contract's createTask transaction to create new [task](ServiceTask) contracts.
1. The beneficiary redeems the tokens, within contract's start and end dates, by sending some or all of them to the task's address, and then using it's settle transaction, see [task](ServiceTask).
