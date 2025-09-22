/**
 * Abstract implementation for service providers
 */
export var TransactionType;
(function (TransactionType) {
    TransactionType["EXTERNAL"] = "external";
    TransactionType["INTERNAL"] = "internal";
    TransactionType["ERC20"] = "erc20";
    TransactionType["ERC721"] = "erc721";
    TransactionType["ERC1155"] = "erc1155";
})(TransactionType || (TransactionType = {}));
/**
 * Abstract implementation for service providers
 */
export var NftAccount;
(function (NftAccount) {
    NftAccount["MINTER"] = "MINTER";
    NftAccount["OWNER"] = "OWNER";
    NftAccount["MINTER_OWNER"] = "MINTER_OWNER";
})(NftAccount || (NftAccount = {}));
