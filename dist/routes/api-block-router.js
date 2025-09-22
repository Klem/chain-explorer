import express from "express";
import { isHash, getNetwork, resolveEns } from '../utils/utils-backend.js';
const router = express.Router();
const network = getNetwork();
/**
 * api/block/latest/:count
 * limited to the last 50 blocks for performance purpose
 */
router.get('/latest/:count', async (req, res) => {
    try {
        let blocks = [];
        let count = req.params.count;
        let latestBlockNumber = await network.getBlockNumber();
        // backed protection against
        // rest requests
        if (count > 50) {
            res.status(422).json({ error: "Count cannot be grater than 50" });
            return;
        }
        console.log(`Lastest block is ${latestBlockNumber}`);
        for (let i = 0; i < count; i++) {
            const blockNumber = latestBlockNumber - i;
            const block = await network.getBlock(blockNumber);
            if (block !== null) {
                blocks.push(block);
            }
            else {
                console.log(`Block ${blockNumber} not found`);
                // count of 1 means autorefresh in blocklist
                if (count == 1) {
                    res.status(404).json({ error: "Block not found", hash: latestBlockNumber.toString() });
                    return;
                }
            }
        }
        res.json({ blocks: blocks });
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching blocks' });
    }
});
/**
 * api/block/:hash
 */
router.get("/:hash", async (req, res) => {
    const hash = req.params.hash;
    if (!hash || !isHash(hash)) {
        res.status(400).json({ error: "Invalid or missing block hash" });
        return;
    }
    try {
        const block = await network.getBlock(hash, true);
        if (!block) {
            res.status(404).json({ error: `Block not found`, "hash": hash });
            return;
        }
        let minedBy = await resolveEns(block.miner);
        res.json({ block: block, transactions: block.prefetchedTransactions, minerName: minedBy });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: `Failed to fetch block`, "hash": hash });
    }
});
export default router;
