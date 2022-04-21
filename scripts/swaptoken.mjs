import 'dotenv/config'
import '../src/utils/Helpers.mjs';
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';
import {timeStamp} from "../src/utils/Helpers.mjs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Slip10RawIndex } from "@cosmjs/crypto";
import {coin, SigningStargateClient} from "@cosmjs/stargate";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx.js";

import { messages, getOsmoFee } from '@cosmology/core';


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
timeStamp('Validator Address:', validator);

const client = await SigningStargateClient.connectWithSigner(rpcUrl, wallet);

const fee = {
    amount: [
        {
            denom: unit,
            amount: feeAmount,
        },
    ],
    gas: gas, // 180k
};

const balance = await client.getBalance(address, swapunit)
    .then(
        (balance) => {
            timeStamp("Total balance:", balance);
            return balance;
        }
    )




const fee2 = getOsmoFee('swapExactAmountIn');
const msg = messages.swapExactAmountIn({
    sender: address, // osmo address
    routes:[{
    "poolId": "605",
    "tokenOutDenom":"uosmo"
    }],
    tokenIn: {
        "denom":"ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228",
        "amount":"310681443"
    }, // Coin
    tokenOutMinAmount: "24201"
});



const result = await client.signAndBroadcast(
    address,
    [
        msg],
    fee,
    ""
).then((result) => {
    timeStamp("Successfully broadcast.");
}, (error) => {
    timeStamp('Failed to broadcast:', error.message)
});


