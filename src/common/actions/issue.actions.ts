import {
    CHANGE_ISSUE_STEP,
    CHANGE_BTC_ADDRESS,
    RESET_ISSUE_WIZARD,
    CHANGE_VAULT_BTC_ADDRESS,
    CHANGE_VAULT_DOT_ADDRESS,
    CHANGE_ISSUE_ID,
    CHANGE_BTC_TX_ID,
    CHANGE_AMOUNT_BTC,
    CHANGE_FEE_BTC,
    ADD_ISSUE_REQUEST,
    UPDATE_ISSUE_REQUEST,
    ADD_TRANSACTION_LISTENER,
    ADD_PROOF_LISTENER,
    ChangeIssueStep,
    ChangeBtcAddress,
    ResetIssueWizard,
    ChangeVaultBtcAddress,
    ChangeVaultDotAddress,
    ChangeIssueId,
    ChangeAmountBtc,
    ChangeBtcTxId,
    ChangeFeeBtc,
    AddIssueRequest,
    UpdateIssueRequest,
    AddTransactionListener,
    AddProofListener
} from "../types/actions.types";
import { IssueRequest } from "../types/issue.types";

export const changeIssueStepAction = (step: string): ChangeIssueStep => ({
    type: CHANGE_ISSUE_STEP,
    step,
});

export const changeAmountBTCAction = (amount: number): ChangeAmountBtc => ({
    type: CHANGE_AMOUNT_BTC,
    amount,
});

export const changeFeeBTCAction = (fee: number): ChangeFeeBtc => ({
    type: CHANGE_FEE_BTC,
    fee,
});

export const changeBTCAddressAction = (btcAddress: string): ChangeBtcAddress => ({
    type: CHANGE_BTC_ADDRESS,
    btcAddress,
});

export const resetIssueWizardAction = (): ResetIssueWizard => ({
    type: RESET_ISSUE_WIZARD,
});

export const changeVaultBtcAddressAction = (vaultBtcAddress: string): ChangeVaultBtcAddress => ({
    type: CHANGE_VAULT_BTC_ADDRESS,
    vaultBtcAddress,
});

export const changeVaultDotAddressAction = (vaultDotAddress: string): ChangeVaultDotAddress => ({
    type: CHANGE_VAULT_DOT_ADDRESS,
    vaultDotAddress,
});

export const changeIssueIdAction = (id: string): ChangeIssueId => ({
    type: CHANGE_ISSUE_ID,
    id,
});

export const changeBtcTxIdAction = (btcTxId: string): ChangeBtcTxId => ({
    type: CHANGE_BTC_TX_ID,
    btcTxId,
});

export const addIssueRequestAction = (request: IssueRequest): AddIssueRequest => ({
    type: ADD_ISSUE_REQUEST,
    request,
});

export const updateIssueRequestAction = (request: IssueRequest): UpdateIssueRequest => ({
    type: UPDATE_ISSUE_REQUEST,
    request,
});

export const addTransactionListener = (id: string): AddTransactionListener => ({
    type: ADD_TRANSACTION_LISTENER,
    id
});

export const addProofListener = (id: string): AddProofListener => ({
    type: ADD_PROOF_LISTENER,
    id
});
