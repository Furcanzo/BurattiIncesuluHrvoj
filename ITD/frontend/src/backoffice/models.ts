import {BackOfficeUser} from "../models";
import {CreateStorePage, INIT} from "./actions";
import {view} from "./view";
import {Component, INavigatorItem, State} from "../noImport";

export class NewStore {
    name: string;
    managerEmail: string;
}
export class CreateStoreAppState extends State<BackOfficeUser> {
    newStore: NewStore;
}

const navigationItems: INavigatorItem[] = [{
    isDefault: true,
    title: "Create Store",
    route: "/createStore",
    onEnter: CreateStorePage,
}]
export const createStoreComponent = new Component(view, INIT, navigationItems);
