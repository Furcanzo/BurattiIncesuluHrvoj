import {LineNumber} from "../models";

export type ServerResult = LineNumber | string;
export class State {
    lastScannedText?: string;
    lastServerResult?: ServerResult;
}
