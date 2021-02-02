import {Clerk, Component, INavigatorItem, LineNumber, State} from "../models";
import {view} from "./views";
import {INIT, OpenGenerateTab, OpenScanTab} from "./actions";

export type ServerResult = LineNumber | string;

export class ClerkAppState extends State<Clerk> {
    lastServerResult?: ServerResult;
    lastGeneratedTicket?: LineNumber;
    activeTab: "generate" | "scan"
}
const clerkRoutes: INavigatorItem[] = [{
    title: "Scan QR",
    route: OpenScanTab,
    isDefault: true,
}, {
    title: "Generate QR",
    route: OpenGenerateTab,
    isDefault: false,
}]

export const clerkComponent = new Component(view, INIT, clerkRoutes);
