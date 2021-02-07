import {ClerkAppState} from "./models";
import {Clerk, IServerLineNumberRequest, IServerLineNumberResponse, IServerStoreResponse} from "../models";
import {State} from "../noImport";
import {reqCheckInOut, reqGenerateQr} from "../requests";
import {Errored} from "../actions";
import {getCurrentTimeMillis, parseServerTimeSlot} from "../util";
import {ManagementStore} from "../manager/models";

export const ReadQRCode = (state: ClerkAppState, qrCodeContent: string) => {
    return [{...state, lastScannedText: qrCodeContent}, reqCheckInOut(ReadServerResponded, Errored, qrCodeContent)];
}

export const INIT = (state: State<Clerk>): ClerkAppState => {
    const oldStore: IServerStoreResponse = state.currentUser.store as any;
    const clientStore: ManagementStore = {
        partners: oldStore.partnerStores as any, // Ids always come from the server.
        timeoutMinutes: oldStore.timeOut / 60 / 1000,
        workingHours: parseServerTimeSlot({startTime: oldStore.workingHour.from, endTime: oldStore.workingHour.until, id:0}),
        ...oldStore,
        location: {
            lat: oldStore.latitude,
            lon: oldStore.longitude,
        },
        maxCustomerCapacity: oldStore.maxCustomers

    }
    return {
        ...state,
        currentUser: {
            ...state.currentUser,
            store: clientStore,
        },
        activeTab: "scan"
    };
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
        storeId: state.currentUser.store.id,
        from: getCurrentTimeMillis(),
        until: getCurrentTimeMillis() + state.currentUser.store.timeoutMinutes * 60 * 1000,
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
        const html = `<img src="${canvas.toDataURL()}" width="200" height="200">`;
        printWindow.document.write(html);
        printWindow.print();
    }
    return state;
}
