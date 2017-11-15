var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "couch solve unique spirit wine fine occur rhythm foot feature glory away";

module.exports = {
  networks: {
    development: {
      host: "35.177.57.188",
      //host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "RINKEBY_PROVIDER_URL"), // This will be replaced at runtime with the key, held by AWS
      network_id: '4' // Official for rinkeby (3 for ropsten) 
    }
  }
};
