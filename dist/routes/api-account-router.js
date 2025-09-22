import express from "express";
import { ethers } from "ethers";
import { getNetwork, getProvider, isHash, resolveEns } from '../utils/utils-backend.js';
import { ProviderRPC, SELECTED_PROVIDER } from "../utils/config.js";
const router = express.Router();
const network = getNetwork();
const provider = getProvider();
/**
 * api/account/address
 * Gets the top level account information
 */
router.get('/:address', async (req, res) => {
    let address;
    try {
        address = req.params.address;
        if (!ethers.isAddress(address)) {
            res.status(400).json({ error: "Invalid address", "hash": address });
            return;
        }
        const balanceWei = await network.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);
        const ens = await resolveEns(address);
        res.json({ balance: balanceEth, ens: ens });
    }
    catch (err) {
        res.status(500).json({ error: "Error fetching block data for", "hash": address });
    }
});
/**
 * api/account/:address/transfers
 * Fetches all transaction for a given account
 */
router.get('/:address/transfers', async (req, res) => {
    let address;
    try {
        address = req.params.address;
        if (!ethers.isAddress(address)) {
            res.status(400).json({ error: "Invalid address", "hash": address });
            return;
        }
        res.json(await provider.getTransactions(address, -1));
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ error: "Error fetching transactions", "hash": address });
        }
        else {
            res.status(500).json({ error: `Unexpected error: ${String(err)}` });
        }
    }
});
/**
 * api/account/:address/nfts
 * Fetches all minted, and owned Nfts by the address
 */
router.get('/:address/nfts', async (req, res) => {
    let address;
    try {
        address = req.params.address;
        if (!ethers.isAddress(address)) {
            res.status(400).json({ error: "Invalid address", "hash": address });
            return;
        }
        if (SELECTED_PROVIDER === ProviderRPC.ETHERSCAN) {
            res.status(501).json({ error: `Etherscan does not support this operation, change the PROVIDER_SELECTED_RPC in the the .env file` });
            return;
        }
        let nfts = await provider.getNfts(address);
        res.json(nfts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching Nft's", "hash": address });
    }
});
/**
 * api/account/:address/nfts
 * Fetches all minted, and owned Nfts by the address
 */
router.get('/:address/tokens', async (req, res) => {
    let address;
    try {
        // extract from here
        address = req.params.address;
        if (!ethers.isAddress(address)) {
            res.status(400).json({ error: "Invalid address", "hash": address });
            return;
        }
        if (SELECTED_PROVIDER === ProviderRPC.ETHERSCAN) {
            res.status(501).json({ error: `Etherscan does not support this operation, change the PROVIDER_SELECTED_RPC in the the .env file` });
            return;
        }
        // to here
        let tokens = await provider.getTokens(address);
        res.json(tokens);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error fetching Tokens`, "hash": address });
    }
});
/**
 * api/account/tx/:hash
 * Fetches the details regarding a transaction
 */
router.get('/tx/:hash', async (req, res) => {
    let hash;
    try {
        // extract from here
        hash = req.params.hash;
        if (!isHash(hash)) {
            res.status(400).json({ error: "Invalid transaction hash", hash: `${hash}` });
            return;
        }
        let tx = await network.getTransaction(hash);
        res.json(tx);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching transaction details", hash: `${hash}` });
    }
});
export default router;
