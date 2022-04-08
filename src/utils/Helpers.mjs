import {
    coin
} from '@cosmjs/stargate'

import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx.js";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx.js";


export function timeStamp(...args) {
    console.log('[' + new Date().toISOString().substring(11, 23) + ']', ...args);
}

export function getTotalReward(address) {

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

export function getTotalRewards(client, address, validators) {
    let timeout = 5000
    return client.queryClient.getRewards(address, { timeout })
        .then(
            (rewards) => {
                const total = Object.values(rewards).reduce((sum, item) => {
                    const reward = item.reward.find(el => el.denom === client.network.denom)
                    if (reward && validators.includes(item.validator_address)) {
                        return sum + parseInt(reward.amount)
                    }
                    return sum
                }, 0)
                return total
            },
            (error) => {
                timeStamp(address, "ERROR skipping this run:", error.message || error)
                return 0
            }
        )
}
