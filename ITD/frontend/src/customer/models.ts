import {
    Customer,
    IServerCustomerResponse,
    IServerLineNumberResponse,
    IServerStoreResponse, IServerTimeSlot,
    LineNumber,
    LineNumberRequest, Time, TimeSlot
} from "../models";
import {BookLineNumber, GetLineNumbers, INIT} from "./actions";
import {Component, INavigatorItem, State} from "../state";
import {view} from "./view";

export class CustomerAppState extends State<Customer> {
    myLineNumbers: LineNumber[];
    newLineNumber: LineNumberRequest;
    showDetailsOf?: LineNumber;
    lineNumberReserved?: LineNumber;
}

const customerRoutes: INavigatorItem[] = [{
    title: "My Numbers",
    isDefault: true,
    route: "/numbers",
    onEnter: GetLineNumbers,
}, {
    title: "Reserve",
    isDefault: false,
    route: "/book",
    onEnter: BookLineNumber,
}];

export const customerComponent = new Component(view, INIT, customerRoutes);
