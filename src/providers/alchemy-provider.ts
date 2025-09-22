import {Alchemy, AssetTransfersCategory, AssetTransfersWithMetadataParams, Network, SortingOrder} from "alchemy-sdk";
import {BlockchainProvider, Nft, NftAccount, Token, TransactionType, Transfer} from "./blockchain-provider.js";
import {SELECTED_PROVIDER_API_KEY} from '../utils/config.js';

/**
 * Non ether.js operation, reliant on a third party provider
 * Alchemy implementation
 */
export class AlchemyProvider implements BlockchainProvider {

    private alchemy: Alchemy;

    constructor() {
        this.alchemy = new Alchemy({
            apiKey: SELECTED_PROVIDER_API_KEY,
            network: Network.ETH_MAINNET, // todo make dynamic in config.ts
        });
    }

    /**
     * Yields all Nfts linked to the address, as owner, minter or both
     * @param address
     */
    async getNfts(address: string): Promise<Nft[]> {
        console.log(`Fetching Nfts for ${address}`);

        /**
         * Nft identifier with composite key
         * `${nft.tokenId}_${nft.contract.address}`
         */
        const list: Map<String, Nft> = new Map();

        /**
         * Fetches owned NFT
         */
        const itOwned = this.alchemy.nft.getNftsForOwnerIterator(address)
        for await (const owned of itOwned) {
            let nft = owned as Nft;
            nft.nftAccount = NftAccount.OWNER
            let key = `${nft.tokenId}_${nft.contract.address}`
            list.set(key, nft);
            console.log(nft)
        }
        console.log(`${list.size} Owned Nfts found`);

        /**
         * Fetches minted Nfts NFT
         */
        const minted = await this.alchemy.nft.getMintedNfts(address)
        console.log(`${minted.nfts.length} Minted Nfts found`);
        let minted_owned: number = 0

        minted.nfts.forEach((mint) => {
            let nft = mint as Nft;
            let key = `${nft.tokenId}_${nft.contract.address}`

            /**
             * special flags for nft that are minted and owned by the same address,
             * based on the key
             */
            nft.nftAccount = list.has(key) ? NftAccount.MINTER_OWNER : NftAccount.MINTER
            minted_owned += nft.nftAccount === NftAccount.MINTER_OWNER ? 1 : 0;
            console.log(nft)
            list.set(key, nft);
        })

        console.log(`${minted_owned} Minted and owned Nfts found`);

        return Promise.resolve(Array.from(list.values()))
    }

    /**
     * Returns all ERC20 tokens that belong to this address
     * @param address
     */
    async getTokens(address: string): Promise<Token[]> {
        console.log(`Fetching Tokens for ${address}`);
        const tokens = await this.alchemy.core.getTokenBalances(address)

        if (tokens.tokenBalances.length === 0) {
            console.log(`No erc20 token found`);
            return Promise.resolve([])
        }

        console.log(`${tokens.tokenBalances.length} erc20 token(s) found`);

        const response: Token[] = []

        for (const token of tokens.tokenBalances) {
            console.log(`Fetching Metadata for ${token.contractAddress}`);
            let metadata = await this.alchemy.core.getTokenMetadata(token.contractAddress);
            let erc: Token = {
                contractAddress: token.contractAddress,
                name: metadata.name,
                symbol: metadata.symbol,
                decimals: metadata.decimals,
                balanceRaw: token.tokenBalance, // en base units (wei-like)
                balance: Number(token.tokenBalance) / 10 ** (metadata.decimals ?? 18),
                logo: metadata.logo
            }
            console.log(metadata)
            response.push(erc);
        }


        return Promise.resolve(response)
    }

    async getTransactions(address: string): Promise<Transfer[]> {
        console.log(`Fetching Transactions for ${address}`);
        const baseParams: AssetTransfersWithMetadataParams = {
            fromBlock: "0x0",
            toBlock: "latest",
            category: [
                AssetTransfersCategory.EXTERNAL,  // eth transfer between owned accounts
                AssetTransfersCategory.INTERNAL,  // transfer triggered by smart contract
                AssetTransfersCategory.ERC20,     // ERC-20 tokens, fungible
                AssetTransfersCategory.ERC721,    // ERC-721, nfts
                AssetTransfersCategory.ERC1155,   // ERC-1155, multi tokens transfers
            ],
            withMetadata: true,         // ✅ gets block timestamp and more
            excludeZeroValue: false,     // ✅ optional: skip zero-value txs
            // maxCount: 0x64,           // ✅ 0x64 = 100 results
            order: SortingOrder.DESCENDING,              // ✅ latest first
        };

        // get transaction from
        baseParams.fromAddress = address
        const responseFrom = await this.alchemy.core.getAssetTransfers(baseParams);
        const transfersFrom = responseFrom.transfers;

        // remove "from" from payload
        // addressFrom and addressTo when both provided acts as an AND union
        delete baseParams.fromAddress;

        // get transaction tp
        baseParams.toAddress = address
        const responseTo = await this.alchemy.core.getAssetTransfers(baseParams);
        const transfersTo = responseTo.transfers;

        // merge results
        const transfers = [...transfersFrom, ...transfersTo];
        console.log(`Found ${transfersFrom.length} outgoing transaction(s), ${transfersTo.length} incoming transaction(s) found, total: ${transfers.length}`);

        // map to common object
        const response: Transfer[] = transfers.map((tx) => ({
            blockNumber: Number(tx.blockNum),
            uniqueId: tx.uniqueId,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value ?? 0,
            category: TransactionType[tx.category.toUpperCase() as keyof typeof TransactionType],
            // timestamp:  new Date(Number(tx.metadata?.blockTimestamp) * 1000).toISOString(),
            timestamp: tx.metadata?.blockTimestamp,
            asset: tx.asset,
            contract: tx.rawContract?.address,
            tokenId: tx.tokenId
        }))

        let sorted = response.sort((a, b) => b.blockNumber - a.blockNumber);

        return Promise.resolve(sorted)

    }

}