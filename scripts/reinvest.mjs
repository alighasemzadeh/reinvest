import { Cosmos } from "../src/index.js";
import message from "@cosmostation/cosmosjs/src/messages/proto";

const mnemonic = process.env.MNEMONIC
const chainId = "cosmoshub-4";
const cosmos = new Cosmos(lcdUrl, chainId);

cosmos.setPath("m/44'/118'/0'/0/0");
const address = cosmos.getAddress(mnemonic);

console.log(address);
