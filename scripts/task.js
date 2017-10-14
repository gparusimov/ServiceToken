var FlexiTimeToken = artifacts.require("./FlexiTimeToken.sol");

module.exports = function(callback) {
  return FlexiTimeToken.deployed().then(function(instance) {
    return instance.createTask('task1', {from: "0xC52edCdea8d5458C7F3FC3e16D7CC454b6893508"});
    // return instance.tasks(0);
  }).then(function(task) {
    console.log(task);
  });

  callback();
}
