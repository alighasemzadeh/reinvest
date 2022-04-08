import 'dotenv/config'
import '../src/utils/Helpers.mjs';
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';
import {timeStamp, reInvest, getTotalRewards} from "../src/utils/Helpers.mjs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Slip10RawIndex, pathToString } from "@cosmjs/crypto";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";

const mnemonic = process.env.MNEMONIC;
const validator = process.env.VALIDATOR;

const directory = CosmosDirectory();

const rpcUrl = directory.rpcUrl('chihuahua');
const restUrl = directory.restUrl('chihuahua');

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
    prefix: 'chihuahua',
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
            denom: "uhuahua",
            amount: "2000",
        },
    ],
    gas: "180000", // 180k
};



const reinvest = await reInvest(address,validator,1000, 'uhuahua');

const result = await client.signAndBroadcast(
    address,
    reinvest,
    fee,
    ""
);

timeStamp(result);
