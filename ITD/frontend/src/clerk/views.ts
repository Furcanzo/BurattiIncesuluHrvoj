import {button, qrCodeGenerator, qrCodeReader, row, text, titleText} from "../widgets";
import {GenerateQR, isLineNumber, PrintQR, ReadQRCode} from "./actions";
import {ClerkAppState} from "./models";
import {PRINTER_FILL} from "../icons";

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
        titleText(state.lastGeneratedTicket.number.toString(), "3"),
        button([PRINTER_FILL, "Print QR"], "primary", PrintQR, "lg"),
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
