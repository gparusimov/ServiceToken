var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "MNEMONIC";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "RINKEBY_PROVIDER_URL"), 
      network_id: '4' // Official for rinkeby (3 for ropsten) 
    }
  }
};
