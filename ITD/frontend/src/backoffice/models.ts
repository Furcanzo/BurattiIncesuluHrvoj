import {BackOfficeUser, Component, INavigatorItem, State} from "../models";
import {CreateStorePage, INIT} from "./actions";
import {view} from "./view";

export class NewStore {
    name: string;
    managerEmail: string;
}
export class CreateStoreAppState extends State<BackOfficeUser> {
    error: string;
    newStore: NewStore;
}

const navigationItems: INavigatorItem[] = [{
    isDefault: true,
    title: "Create Store",
    route: CreateStorePage,
}]
export const createStoreComponent = new Component(view, INIT, navigationItems);
