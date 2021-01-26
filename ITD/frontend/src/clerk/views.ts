import {qrCodeReader, row, text} from "../widgets";
import {isLineNumber, QR_CODE_READ} from "./actions";
import {ClerkAppState} from "./models";

export const qrCodeReadPane = (state: ClerkAppState) => {
    const lastRead = state.lastServerResult ? [
        isLineNumber(state.lastServerResult)
            ? text(`Line Number: ${state.lastServerResult.number}`)
            : text(`Scanned QR code is invalid`)
    ]: [];

    const scanner = [
        text("Scan code here:"),
        qrCodeReader(QR_CODE_READ)
    ];
    return row([
        ...lastRead,
        ...scanner,
    ]);
}

