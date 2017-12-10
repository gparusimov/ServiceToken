var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "myth like bonus scare over problem client lizard pioneer submit female collect";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/PaJsiik099LNct8ZKMlH"), 
      network_id: '4' // Official for rinkeby (3 for ropsten) 
    }
  }
};
