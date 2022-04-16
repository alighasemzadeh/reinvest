import {
    coin
} from '@cosmjs/stargate'

import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx.js";
import axios from "axios";

export function timeStamp(...args) {
    console.log('[' + new Date().toISOString().substring(11, 23) + ']', ...args);
}

export function getTotalRewards(address) {
    var total = 0;
    axios.get('https://api.chihuahua.wtf/cosmos/distribution/v1beta1/delegators/'+address+'/rewards')
        .then(function (response) {
            // handle success
            total = response.data.total[0].amount;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            total = 0;
        })
        .then(function () {
            total = 0;
        });

    return total
}

export function reInvest(address, validatorAddress, amount, denom) {
    return [{
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: MsgWithdrawDelegatorReward.encode(MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: address,
            validatorAddress: validatorAddress
        })).finish()
    }, {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.encode(MsgDelegate.fromPartial({
            delegatorAddress: address,
            validatorAddress: validatorAddress,
            amount: coin(amount, denom)
        })).finish()
    }]
}
