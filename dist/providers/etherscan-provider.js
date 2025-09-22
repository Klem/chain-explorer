import { TransactionType } from "./blockchain-provider.js";
import { SELECTED_PROVIDER_URL } from '../utils/config.js';
/**
 * Non ether.js operation, reliant on a third party provider
 * Etherscan  implementation
 */
export class EtherscanProvider {
    constructor() {
        // this.etherscan = new Etherscan();
    }
    getNfts(address) {
        console.error("Etherscan cannot fetch Nfts!");
        return Promise.resolve([]);
    }
    getTokens(address) {
        console.error("Etherscan cannot fetch Tokens!");
        return Promise.resolve([]);
    }
    async getTransactions(address, maxCount) {
        const endpoints = [
            { action: "txlist", category: TransactionType.EXTERNAL },
            { action: "txlistinternal", category: TransactionType.INTERNAL },
            { action: "tokentx", category: TransactionType.ERC20 },
            { action: "tokennfttx", category: TransactionType.ERC721 },
            { action: "token1155tx", category: TransactionType.ERC1155 },
        ];
        const all = [];
        for (const { action, category } of endpoints) {
            let page = 1;
            while (true) {
                const chunk = await this.fetchTransactions(action, address, page);
                if (chunk.length === 0)
                    break;
                for (const tx of chunk) {
                    const mapped = {
                        blockNumber: Number(tx.blockNumber),
                        uniqueId: "0",
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: tx.value,
                        timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
                        category: category,
                        contract: tx.contractAddress || tx.tokenContract,
                        tokenId: tx.tokenID,
                    };
                    all.push(mapped);
                }
                page += 1;
            }
        }
        all.sort((a, b) => b.blockNumber - a.blockNumber);
        return Promise.resolve(all);
    }
    /**
     * Execute each transaction request to etherscan
     * @param action
     * @param address
     * @param page
     * @private
     */
    async fetchTransactions(action, address, page) {
        const params = new URLSearchParams({
            module: "account",
            action,
            address,
            startblock: "0",
            endblock: "latest",
            page: page.toString(),
            offset: "1000",
            sort: "desc",
            chainid: "1"
        });
        console.log(`requesting ${SELECTED_PROVIDER_URL}&${params}`);
        let json;
        try {
            const res = await fetch(`${SELECTED_PROVIDER_URL}&${params}`);
            json = await res.json();
            let message = json.status == 1 ? `${json.result.length} transaction(s) found` : `${json.message}`;
            console.log(message);
        }
        catch (err) {
            console.error(err);
        }
        return json.status === "1" ? json.result : [];
    }
}
