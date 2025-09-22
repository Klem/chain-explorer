import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
export var ProviderRPC;
(function (ProviderRPC) {
    ProviderRPC["ALCHEMY"] = "PROVIDER_ALCHEMY_RPC";
    ProviderRPC["ETHERSCAN"] = "PROVIDER_ETHERSCAN_RPC";
})(ProviderRPC || (ProviderRPC = {}));
const network = (process.env.ETH_SELECTED_RPC || 'ETH_LOCAL_RPC'); // fallback, requires local node
const provider = (process.env.PROVIDER_SELECTED_RPC || ProviderRPC.ALCHEMY);
const rpcUrls = {
    ETH_MAIN_RPC: process.env.ETH_MAIN_RPC,
    ETH_TEST_RPC: process.env.ETH_TEST_RPC,
    ETH_LOCAL_RPC: process.env.ETH_LOCAL_RPC,
};
const providersUrls = {
    PROVIDER_ALCHEMY_RPC: process.env.PROVIDER_ALCHEMY_RPC + "/" + process.env.PROVIDER_ALCHEMY_API_KEY,
    PROVIDER_ETHERSCAN_RPC: process.env.PROVIDER_ETHERSCAN_RPC + "?apikey=" + process.env.PROVIDER_ETHERSCAN_API_KEY
};
const providersApiKeys = {
    PROVIDER_ALCHEMY_RPC: process.env.PROVIDER_ALCHEMY_API_KEY,
    PROVIDER_ETHERSCAN_RPC: process.env.PROVIDER_ETHERSCAN_API_KEY,
};
if (!rpcUrls[network]) {
    throw new Error(`Missing RPC URL for selected network: ${network}`);
}
if (!providersUrls[provider]) {
    throw new Error(`Missing PROVIDER URL for selected provider: ${provider}`);
}
if (!providersApiKeys[provider]) {
    throw new Error(`Missing PROVIDER API KEY for selected provider: ${provider}`);
}
export const SELECTED_RPC_URL = rpcUrls[network];
export const SELECTED_PROVIDER_URL = providersUrls[provider];
export const SELECTED_PROVIDER_API_KEY = providersApiKeys[provider];
export const SELECTED_PROVIDER = provider;
