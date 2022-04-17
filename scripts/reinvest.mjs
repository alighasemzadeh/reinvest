import 'dotenv/config'
import '../src/utils/Helpers.mjs';
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';
import {timeStamp, reInvest, getTotalRewards} from "../src/utils/Helpers.mjs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Slip10RawIndex, pathToString } from "@cosmjs/crypto";
import {coin, SigningStargateClient, StargateClient} from "@cosmjs/stargate";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx.js";

const mnemonic = process.env.MNEMONIC;
const validator = process.env.VALIDATOR;
const network = process.env.NETWORK;
const unit = process.env.UNIT;
const prefix = process.env.PREFIX;

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
            amount: "2000",
        },
    ],
    gas: "180000", // 180k
};



//const totalReward = getTotalRewards(address);


//timeStamp('Total reward:', totalReward);

const result = await client.signAndBroadcast(
    address,
    [{
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.encode(MsgDelegate.fromPartial({
            delegatorAddress: address,
            validatorAddress: validator,
            amount: coin(10000, unit)
        })).finish()
    }],
    fee,
    ""
);

timeStamp(result);
