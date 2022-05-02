const Voting = artifacts.require('Voting');

module.exports = function (deployer) {
    deployer.deploy(Voting, [web3.utils.utf8ToHex('Rama'), web3.utils.utf8ToHex('Nick'), web3.utils.utf8ToHex('Jose')]);
};
