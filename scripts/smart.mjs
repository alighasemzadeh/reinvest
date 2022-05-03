
import Web3 from "web3";

const provider =
    "https://main-light.eth.linkpool.io"

const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

// The minimum ABI required to get the ERC20 Token balance
const minABI = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];
const tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const walletAddress = "0x1CEF8c189D56b33389ABE5a938F517EAa168397a";

const contract = new Web3Client.eth.Contract(minABI, tokenAddress);

async function getBalance() {
    const result = await contract.methods.balanceOf(walletAddress).call(); // 29803630997051883414242659

    const format = Web3Client.utils.fromWei(result); // 29803630.997051883414242659

    console.log(format);
}

getBalance();


const mybalance = Web3Client.eth.getBalance(walletAddress);
console.log(mybalance);
