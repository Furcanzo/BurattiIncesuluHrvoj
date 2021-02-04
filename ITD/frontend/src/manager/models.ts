import {Manager, Store} from "../models";
import {INIT, LoadMonitoringTab, LoadStaffTab, LoadUpdateStoreTab} from "./actions";
import {row, text} from "../widgets";
import {Component, INavigatorItem, State, User} from "../state";
import {view} from "./view";

export class ManagerAppState extends State<Manager> {
    activeTab: "update" | "staff" | "monitor";
    staffMembers: User[];
    newMember: User;
    store: Store;
    updatingStore: Store;
    foundPartnerStore?: Store;
    newPartnerStoreId?: string;
    numberOfVisitors?: number;
}

const navigationItems: INavigatorItem[] = [{
    title: "Update Store",
    isDefault: false,
    route: "/updateStore",
    onEnter: LoadUpdateStoreTab,
}, {
    title: "Manage Staff",
    isDefault: false,
    route: "/manageStaff",
    onEnter: LoadStaffTab,
}, {
    title: "Monitor",
    isDefault: true,
    route: "/monitor",
    onEnter: LoadMonitoringTab,
}].reverse();

export const managerComponent = new Component(view, INIT, navigationItems);
