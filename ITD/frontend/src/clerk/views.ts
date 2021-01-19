import {Customer, LineNumber} from "../models";
import {qrCodeReader, row, text} from "../widgets";
import {QR_CODE_READ} from "./actions";

const qrCodeReadPane = (scanResult?: LineNumber | string) => {
    /*If last scan was successful, it is line number, if string then error, if undefined no last scan*/
    return row(text("Who knows"), qrCodeReader(QR_CODE_READ))
}
