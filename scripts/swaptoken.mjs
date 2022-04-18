import 'dotenv/config'
import '../src/utils/Helpers.mjs';
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';
import {timeStamp} from "../src/utils/Helpers.mjs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Slip10RawIndex } from "@cosmjs/crypto";
import {coin, SigningStargateClient} from "@cosmjs/stargate";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx.js";

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




const result = await client.signAndBroadcast(
    address,
    [
        {
            typeUrl: "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn",
            value: MsgDelegate.fromPartial({
                delegatorAddress: address,
                validatorAddress: validator,
                amount: coin(balance.amount, unit)
            })
        }],
    fee,
    ""
).then((result) => {
    timeStamp("Successfully broadcast.");
}, (error) => {
    timeStamp('Failed to broadcast:', error.message)
});


