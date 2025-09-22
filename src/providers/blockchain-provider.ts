/**
 * Abstract implementation for service providers
 */
export enum TransactionType {
    EXTERNAL = "external",
    INTERNAL = "internal",
    ERC20 = "erc20",
    ERC721 = "erc721",
    ERC1155 = "erc1155",
}

/**
 * Abstract implementation for service providers
 */
export enum NftAccount {
    MINTER = "MINTER",
    OWNER = "OWNER",
    MINTER_OWNER = "MINTER_OWNER"
}

export interface Nft {
    contract: {
        address: string;
        name?: string;
        symbol?: string;
        totalSupply?: number;
        tokenType?: 'ERC721' | 'ERC1155' | string;
        contractDeployer?: string;
        deployedBlockNumber?: number;
        openSeaMetadata?: {
            floorPrice?: number;
            collectionName?: string;
            collectionSlug?: string;
            safelistRequestStatus?: string;
            imageUrl?: string;
            description?: string;
            externalUrl?: string;
            twitterUsername?: string;
            discordUrl?: string;
            bannerImageUrl?: string;
            lastIngestedAt?: string;
        };
        isSpam?: boolean;
        spamClassifications?: string[];
    };
    tokenId?: string;
    tokenType?: 'ERC721' | 'ERC1155' | string;
    nftAccount?: NftAccount | string
    name?: string;
    description?: string;
    tokenUri?: string;
    image?: {
        cachedUrl?: string;
        thumbnailUrl?: string;
        pngUrl?: string;
        contentType?: string;
        size?: number;
        originalUrl?: string;
    };
    animation?: {
        cachedUrl?: string;
        contentType?: string;
        size?: number;
        originalUrl?: string;
    };
    raw?: {
        tokenUri?: string;
        metadata?: {
            name?: string;
            description?: string;
            image?: string;
            attributes?: any[]; // You can replace `any` with a specific attribute type if known
        };
        error?: string;
    };
    collection?: {
        name?: string;
        slug?: string;
        externalUrl?: string;
        bannerImageUrl?: string;
    };
    mint?: {
        mintAddress?: string;
        blockNumber?: number;
        timestamp?: string;
        transactionHash?: string;
    };
    owners?: string[];
    timeLastUpdated?: string;
    balance?: string;
    acquiredAt?: {
        blockTimestamp?: string;
        blockNumber?: number;
    };
}


export interface Token {
    contractAddress: string | null;
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    balanceRaw: string | null; // in wei
    balance: number | null;
    logo: string | null;
}


export interface Transfer {
    blockNumber: number;
    uniqueId: string | null;
    hash: string;
    from: string;
    to: string | null;
    value: number | string; // en wei ou string
    category: TransactionType;
    timestamp: string;
    asset?: string | null;
    contract: string | null;
    tokenId: string | null;
}

export interface BlockchainProvider {

    /**
     * Returns all erc20 tokens owned by the address
     * Obscure tokens may not be returned properly
     * @param address
     */
    getTokens(address: string): Promise<Token[]>;

    /**
     * Return all owned and minted Nfts by the address
     * @param address
     */
    getNfts(address: string): Promise<Nft[]>;

    /**
     * Returns all the transaction linked to an account
     * Includes all transaction defined in @TransactionType
     * @param address
     * @param maxCount
     */
    getTransactions(address: string, maxCount?: number): Promise<Transfer[]>;
}