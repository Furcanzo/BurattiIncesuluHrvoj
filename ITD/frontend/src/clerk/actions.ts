import {ClerkAppState} from "./models";
import {Clerk, IServerLineNumberRequest, IServerLineNumberResponse} from "../models";
import {State} from "../state";
import {reqCheckInOut, reqGenerateQr} from "../requests";
import {Errored} from "../actions";
import {getCurrentTimeMillis} from "../util";

export const ReadQRCode = (state: ClerkAppState, qrCodeContent: string) => {
    return [{...state, lastScannedText: qrCodeContent}, reqCheckInOut(ReadServerResponded, Errored, qrCodeContent)];
}

export const INIT = (state: State<Clerk>): ClerkAppState => {
    return state as ClerkAppState;
}
export const ReadServerResponded = (state: ClerkAppState, content: IServerLineNumberResponse): ClerkAppState => {
    return {...state, lastCheckInOut: content};
}

export const OpenGenerateTab = (state: ClerkAppState): ClerkAppState => {
    return {...state, activeTab: "generate"}
};

export const OpenScanTab = (state: ClerkAppState): ClerkAppState => {
    return {...state, activeTab: "scan"}
}

export const GenerateQR = (state: ClerkAppState) => {
    const lineNumberInfo: IServerLineNumberRequest = {
        storeId: state.currentUser.location.id,
        from: getCurrentTimeMillis(),
        until: getCurrentTimeMillis() + state.currentUser.location.timeoutMinutes,
        timeSlotId: null,
    }

    return [state, reqGenerateQr(QRGenerated, Errored, lineNumberInfo)];
}
export const QRGenerated = (state: ClerkAppState, ticket: IServerLineNumberResponse): ClerkAppState => {
    return {...state, lastGeneratedTicket: ticket};
}

export const PrintQR = (state: ClerkAppState) => {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        const canvas = canvases[0];
        const printWindow = window.open("");
        printWindow.document.write(canvas.outerHTML);
        printWindow.print();
    }
    return state;
}
