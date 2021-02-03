import {ClerkAppState} from "./models";
import {Clerk, LineNumber} from "../models";
import {http} from "../effects";
import {State} from "../state";

export const isLineNumber = (response: any): response is LineNumber => {
    return response.hasOwnProperty("number");
}

const serverError = (response: any): string => {
    return response?.error; //TODO: Maybe we will send the error text in a body for 500?
}

const VERIFY_PATH = "QR/verify";
export const ReadQRCode = (state: ClerkAppState, qrCodeContent: string) => {
    return [{...state, lastScannedText: qrCodeContent}, http({
        path: VERIFY_PATH,
        method: "POST",
        body: {code: qrCodeContent},
        resultAction: ReadServerResponded,
        errorAction: NetworkError,
    })];
}

export const INIT = (state: State<Clerk>): ClerkAppState => {
    return state as ClerkAppState;
}
export const ReadServerResponded = (state: ClerkAppState, content: object): ClerkAppState => {
    if (isLineNumber(content)) {
        return {...state, lastServerResult: content};
    } else if (serverError(content)) {
        return {...state, lastServerResult: serverError(content)};
    } else {
    }
}
export const NetworkError = (state: ClerkAppState): ClerkAppState => {
    return {...state, lastServerResult: "Network Error!"};
}

export const OpenGenerateTab = (state: ClerkAppState): ClerkAppState => {
    return {...state, activeTab: "generate"}
};

export const OpenScanTab = (state: ClerkAppState): ClerkAppState => {
    return {...state, activeTab: "scan"}
}

const GENERATE_PATH = "QR/generate";
export const GenerateQR = (state: ClerkAppState) => {
    return [state, http({
        path: GENERATE_PATH,
        method: "POST",
        resultAction: QRGenerated,
        errorAction: NetworkError,
    })]
}
export const QRGenerated = (state: ClerkAppState, ticket: LineNumber): ClerkAppState => {
    return {...state, lastGeneratedTicket: ticket};
}
