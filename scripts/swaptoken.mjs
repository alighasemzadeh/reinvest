import 'dotenv/config'
import '../src/utils/Helpers.mjs';
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';
import {timeStamp} from "../src/utils/Helpers.mjs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Slip10RawIndex } from "@cosmjs/crypto";

import { messages, getOsmoFee, lookupRoutesForTrade, getSigningOsmosisClient, prettyPool, OsmosisApiClient,calculateAmountWithSlippage } from '@cosmology/core';


const mnemonic = process.env.MNEMONIC;
const validator = process.env.VALIDATOR;
const network = process.env.NETWORK;
const unit = process.env.UNIT;
const swapunit = process.env.SWAPUNIT;
const prefix = process.env.PREFIX;
const feeAmount = process.env.FEE_AMOUNT;
const gas = process.env.GAS;

const directory = CosmosDirectory();

const rpcUrl = directory.rpcUrl(network);
const restUrl = directory.restUrl(network);

timeStamp('Using REST URL:', restUrl);
timeStamp('Using RPC URL:', rpcUrl);

let hdPath = [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(118),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
];


const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: prefix,
    hdPaths: [hdPath]
});


const accounts = await wallet.getAccounts();
const address = accounts[0].address;

timeStamp('Wallet Address:', address);

const client = await getSigningOsmosisClient({
    rpcEndpoint: rpcUrl,
    signer: wallet
});

const balance = await client.getBalance(address, swapunit)
    .then(
        (balance) => {
            return balance;
        }
    )

const tokenOutMinAmountValue =  calculateAmountWithSlippage(
    balance.amount,
    3
);

const tokenOutMinAmountInt =  Math.floor(tokenOutMinAmountValue);


timeStamp('Token In:', balance.amount);
timeStamp('Token Out:', tokenOutMinAmountValue);

const current_fee = getOsmoFee('swapExactAmountIn');
const msg = messages.swapExactAmountIn({
    sender: address, // osmo address
    routes:[{
        "poolId": "605",
        "tokenOutDenom":"uosmo"
    }],
    tokenIn: {
        "denom":swapunit,
        "amount":balance.amount
    }, // Coin
    tokenOutMinAmount: "1000"
});



const result = await client.signAndBroadcast(
    address,
    [msg],
    current_fee,
    ""
).then((result) => {
    timeStamp("Successfully broadcast.");
}, (error) => {
    timeStamp('Failed to broadcast:', error.message)
});


