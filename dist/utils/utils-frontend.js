/**
 * Check hash validity
 * different from address of ethers.isAddress()
 * @param hash
 */
export function isHash(hash) {
    return /^0x([A-Fa-f0-9]{64})$/.test(hash);
}
/**
 * Evaluate the transaction type based on the data present in the transaction.
 * @param tx
 */
export function getTransactionType(tx) {
    if (!tx.data || tx.data === "0x") {
        return "ETH_TRANSFER";
    }
    if (!tx.to) {
        return "CONTRACT_DEPLOYMENT";
    }
    return "CONTRACT_CALL";
}
/**
 * Inject data in a handlebar template
 * @param templatePath path to the hbs
 * @param context dataset to inject
 * @param domElement to inject to
 */
export async function renderWithTemplate(templatePath, context, domElement) {
    console.log(`Injecting data in  ${templatePath} for element ${domElement.id}`);
    const res = await fetch(templatePath);
    const text = await res.text();
    const template = Handlebars.compile(text);
    domElement.innerHTML = template(context);
}
/**
 * Utility function for error rendering using the error.hbs template
 * @param error dataset to inject. currently supported {"error":"string", "hash":string?"}
 * @param hashOrDomElement
 * @param domElement to inject to
 */
export async function renderError(error, hashOrDomElement, domElement) {
    let context;
    let container;
    if (typeof error === 'string') {
        context = {
            error,
            hash: typeof hashOrDomElement === 'string' ? hashOrDomElement : undefined,
        };
        container = typeof hashOrDomElement === 'object' ? hashOrDomElement : domElement;
    }
    else {
        context = error;
        container = hashOrDomElement;
    }
    await renderWithTemplate("/templates/error.hbs", context, container);
}
export async function renderSpinner(message, domElement) {
    const context = { message };
    await renderWithTemplate("/templates/spinner.hbs", context, domElement);
}
/**
 * Register the sub templates for the hbs compiler
 */
let partialsRegistered = false; // do no fetch everytime
export async function registerHbsPartials() {
    if (partialsRegistered)
        return;
    const res = await fetch('/templates/error.hbs');
    const partialText = await res.text();
    Handlebars.registerPartial('error', partialText);
    console.log("Hbs partials registered");
    partialsRegistered = true;
}
/**
 * Hbs Helper: stringifyJson
 */
Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});
Handlebars.registerHelper('transactionType', function (context) {
    return getTransactionType(context);
});
Handlebars.registerHelper('formatTimestamp', function (timestamp) {
    const d = new Date(timestamp * 1000);
    return d.toUTCString();
});
// Handlebars.registerHelper('formatEther', function (wei: string | number | bigint) {
//     return formatEthers(wei)
// });
