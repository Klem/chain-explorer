import { renderWithTemplate } from '../utils/utils-frontend.js';
/**
 * Create an modal shell with the provided Id
 * @param id
 */
function createModal(id) {
    let modal = document.getElementById(id);
    // create only once
    if (modal)
        return modal;
    modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', `${id}_Label`);
    document.body.appendChild(modal);
    return modal;
}
/**
 * Modal for transaction details
 * @param modalId the modal Id to populate
 * @param tx JSON details of the transaction
 */
export async function showTxModal(modalId, tx) {
    const modal = createModal(modalId);
    await renderWithTemplate('/templates/modal-tx-details.hbs', tx, modal);
    const bsModal = new window.bootstrap.Modal(modal);
    bsModal.show();
}
/**
 * Modal for Nft details
 * @param modalId the modal Id to populate
 * @param tx JSON details of the transaction
 */
export async function showNftModal(modalId, tx) {
    const modal = createModal(modalId);
    await renderWithTemplate('/templates/modal-nft-details.hbs', tx, modal);
    const bsModal = new window.bootstrap.Modal(modal);
    bsModal.show();
}
