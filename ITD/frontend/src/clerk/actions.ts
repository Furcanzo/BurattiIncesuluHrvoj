import {ClerkAppState} from "./models";
import {LineNumber, State} from "../models";
import {http} from "../effects";

export const isLineNumber = (response: any): response is LineNumber => {
    return response.hasOwnProperty("number");
}

const serverError = (response: any): string => {
    return response?.error;
}

const VERIFY_PATH = "/verify";
export const QR_CODE_READ = (state: ClerkAppState, qrCodeContent: string) => {
    return [{...state, lastScannedText: qrCodeContent}, http({
        path: VERIFY_PATH,
        method: "POST",
        body: {code: qrCodeContent},
        resultAction: SERVER_RESPONDED,
        errorAction: NETWORK_ERRORED,
    })];
}

export const INIT = (state: State): ClerkAppState => {
    return state;
}
export const SERVER_RESPONDED = (state: ClerkAppState, content: object): ClerkAppState => {
    if (isLineNumber(content)) {
        return {...state, lastServerResult: content};
    } else if (serverError(content)) {
        return {...state, lastServerResult: serverError(content)};
    } else {
    }
}
export const NETWORK_ERRORED = (state: ClerkAppState): ClerkAppState => {
    return {...state, lastServerResult: "Network Error!"};
}
