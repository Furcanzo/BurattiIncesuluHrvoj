import {Clerk, IServerLineNumberResponse, LineNumber} from "../models";
import {view} from "./views";
import {INIT, OpenGenerateTab, OpenScanTab} from "./actions";
import {Component, INavigatorItem, State} from "../state";


export class ClerkAppState extends State<Clerk> {
    lastCheckInOut?: IServerLineNumberResponse;
    lastGeneratedTicket?: IServerLineNumberResponse;
    activeTab: "generate" | "scan"
}

const clerkRoutes: INavigatorItem[] = [{
    title: "Scan QR",
    route: "/scan",
    isDefault: true,
    onEnter: OpenScanTab,
}, {
    title: "Generate QR",
    route: "/generate",
    isDefault: false,
    onEnter: OpenGenerateTab,
}]

export const clerkComponent = new Component(view, INIT, clerkRoutes);
