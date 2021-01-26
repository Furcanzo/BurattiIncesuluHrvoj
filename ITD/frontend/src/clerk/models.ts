import {Component, LineNumber, State} from "../models";
import {qrCodeReadPane} from "./views";
import {INIT} from "./actions";

export type ServerResult = LineNumber | string;

export class ClerkAppState extends State {
    lastScannedText?: string;
    lastServerResult?: ServerResult;
}

export const clerkComponent = new Component(qrCodeReadPane, INIT);
