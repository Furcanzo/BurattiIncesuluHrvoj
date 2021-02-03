import {Customer, LineNumber, LineNumberRequest} from "../models";
import {BookLineNumber, GetLineNumbers, INIT} from "./actions";
import {row, text} from "../widgets";
import {Component, INavigatorItem, State} from "../state";

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

export const customerComponent = new Component((state) => row(text("TODO")), INIT, customerRoutes);
