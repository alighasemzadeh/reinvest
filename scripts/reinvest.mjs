import 'dotenv/config'
import CosmosDirectory from '../src/utils/CosmosDirectory.mjs';

const directory = CosmosDirectory();

const rpcUrl = directory.rpcUrl('chihuahua');
const restUrl = directory.restUrl('chihuahua');

console.log(restUrl);
console.log(rpcUrl);
