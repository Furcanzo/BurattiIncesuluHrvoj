import {button, centered, qrCodeGenerator, qrCodeReader, row, text, titleText} from "../widgets";
import {GenerateQR, PrintQR, ReadQRCode} from "./actions";
import {ClerkAppState} from "./models";
import {PRINTER_FILL} from "../icons";

const qrCodeReadPane = (state: ClerkAppState) => {
    const lastRead = state.lastCheckInOut ? [
        text(`Line Number: ${state.lastCheckInOut.number} checked ${state.lastCheckInOut.status === "VISITING" ? "in" : "out"}.`)
    ]: [];

    const scanner = [
        text("Scan code here:"),
        qrCodeReader(ReadQRCode)
    ];
    return [
        ...lastRead,
        ...scanner,
    ];
}

 const qrCodeGeneratePane = (state: ClerkAppState) => {

    const generated = state.lastGeneratedTicket ? [
        text("Here is the last generated ticket:"),
        qrCodeGenerator(state.lastGeneratedTicket.id.toString()),
        titleText(state.lastGeneratedTicket.number.toString(), "3"),
        button([PRINTER_FILL, text("Print QR")], "primary", PrintQR, "lg"),
    ].map(centered): [];

    const generateNew = button("Generate a new ticket", "primary", GenerateQR);
    return [
        ...generated,
        generateNew,
    ]
}

export const view = (state: ClerkAppState) => {
    if (state.activeTab === "scan") {
        return qrCodeReadPane(state);
    } else {
        return qrCodeGeneratePane(state);
    }
}
