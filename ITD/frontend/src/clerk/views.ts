import {button, qrCodeGenerator, qrCodeReader, row, text, titleText} from "../widgets";
import {GenerateQR, isLineNumber, ReadQRCode} from "./actions";
import {ClerkAppState} from "./models";

const qrCodeReadPane = (state: ClerkAppState) => {
    const lastRead = state.lastServerResult ? [
        isLineNumber(state.lastServerResult)
            ? text(`Line Number: ${state.lastServerResult.number}`)
            : text(`Scanned QR code is invalid`)
    ]: [];

    const scanner = [
        text("Scan code here:"),
        qrCodeReader(ReadQRCode)
    ];
    return row([
        ...lastRead,
        ...scanner,
    ]);
}

 const qrCodeGeneratePane = (state: ClerkAppState) => {

    const generated = state.lastGeneratedTicket ? [
        text("Here is the last generated ticket:"),
        qrCodeGenerator(state.lastGeneratedTicket.id),
        titleText(state.lastGeneratedTicket.number.toString(), "3")
    ]: [];

    const generateNew = button("Generate a new ticket", "primary", GenerateQR);
    return row([
        ...generated,
        generateNew,
    ])
}

export const view = (state: ClerkAppState) => {
    if (state.activeTab === "scan") {
        return qrCodeGeneratePane(state);
    } else {
        return qrCodeReadPane(state);
    }
}
