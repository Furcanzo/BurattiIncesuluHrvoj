import {Component, Customer, INavigatorItem, LineNumber, LineNumberRequest, State} from "../models";
import {BookLineNumber, GetLineNumbers, INIT} from "./actions";
import {row, text} from "../widgets";

export class CustomerAppState extends State<Customer> {
    myLineNumbers: LineNumber[];
    newLineNumber: LineNumberRequest;
    showDetailsOf?: LineNumber;
    lineNumberReserved?: LineNumber;
}

const customerRoutes: INavigatorItem[] = [{
    title: "My Numbers",
    isDefault: true,
    route: GetLineNumbers,
}, {
    title: "Reserve",
    isDefault: false,
    route: BookLineNumber,
}];

export const customerComponent = new Component((state) => row(text("TODO")), INIT, customerRoutes);
