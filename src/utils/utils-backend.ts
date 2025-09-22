import {ethers} from "ethers";
import {SELECTED_RPC_URL, ProviderRPC, SELECTED_PROVIDER} from './config.js';
import {BlockchainProvider} from "../providers/blockchain-provider.js";
import {AlchemyProvider} from "../providers/alchemy-provider.js";
import {EtherscanProvider} from "../providers/etherscan-provider.js";


/**
 * Check hash validity
 * @param hash
 */
export function isHash(hash: string) {
    return  /^0x([A-Fa-f0-9]{64})$/.test(hash);
}


/**
 * Change provider based on network provided to hardhat
 * eg npx hardhat --network hardhat
 *
 * // TODO
 * Network switching localhost / mainnet
 *
 */
export function getNetwork(): ethers.JsonRpcProvider {
    return new ethers.JsonRpcProvider(SELECTED_RPC_URL!);
}

/**
 * Returns the proper implementation of the selected provider RPC (alchemy, etherscan)
 */
export function getProvider(): BlockchainProvider {
    if (SELECTED_PROVIDER == ProviderRPC.ALCHEMY) {
        return new AlchemyProvider()
    }
        return new EtherscanProvider()
}

/**
 * Retrieves the ens from a given address. not supported on all networks
 * @param address
 */
export async function resolveEns(address: string) {
    let ens ;

    try {
        ens = await getNetwork().lookupAddress(address)
        // ens = ens == null ? "No ens found" : ens;
        ens = ens ?? "No ens found";
    } catch (unsupported) {
        console.log(unsupported)
        ens = (unsupported as { shortMessage: string }).shortMessage;
    }

    return ens;
}

/**
 * Make the ether.formatEthers from ethers.js accessible to the frontend
 * @param wei
 */
export function formatEthers(wei: string | number | bigint): string {
    return ethers.formatEther(wei ?? 0);
}