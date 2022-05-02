import 'bootstrap/scss/bootstrap.scss';
import Web3 from 'web3';
import contract from 'truffle-contract';
import VotingContract from '../../build/contracts/Voting.json';
const Voting = contract(VotingContract);
const candidates = {'Rama': 'candidate-1', 'Nick': 'candidate-2', 'Jose': 'candidate-3'};

const App = {
    web3: null,
    account: null,
    meta: null,
    voteForCandidate: async function () {
        const candidateName = document.querySelector('#candidate').value;
        try {
            document.querySelector('#msg').innerHTML = 'Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.';
            document.querySelector('#candidate').value = '';

            const contractInstance = await Voting.deployed();
            this.web3.eth.getAccounts(async (err, addresses) => {
                if (err) {
                    console.log(err);
                } else {
                    await contractInstance.voteForCandidate(this.web3.utils.utf8ToHex(candidateName), {
                        gas: 140000,
                        from: addresses[0]
                    });

                    const div_id = candidates[candidateName];
                    const v = await contractInstance.totalVotesFor.call(this.web3.utils.utf8ToHex(candidateName));
                    document.querySelector('#' + div_id).innerHTML = (v.toString());
                    document.querySelector('#msg').innerHTML = ('');
                }
            });


        } catch (e) {
            console.error(e);
        }
    },
};

window.App = App;

window.addEventListener('load', function () {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    } else {
        App.web3 = new Web3(
            new Web3.providers.HttpProvider('http://127.0.0.1:8545'),
        );
    }
    Voting.setProvider(App.web3.currentProvider);

    const candidateNames = Object.keys(candidates);
    for (let i = 0; i < candidateNames.length; i++) {
        const name = candidateNames[i];
        Voting.deployed().then(function (contractInstance) {
            contractInstance.totalVotesFor.call(App.web3.utils.utf8ToHex(name)).then(function (v) {
                document.querySelector('#' + candidates[name]).innerHTML = (v.toString());
            });
        });
    }

    document.querySelector('#voteFor').addEventListener('click', () => {
        App.voteForCandidate();
    });
});
