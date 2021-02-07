import {Manager} from "../models";
import {INIT, LoadMonitoringTab, LoadStaffTab, LoadUpdateStoreTab} from "./actions";
import {Component, INavigatorItem, State, Store, User} from "../noImport";
import {view} from "./view";

export interface IManagementPartnerStore {
    id: number;
    name: string;
}

export class ManagementStore extends Store {
    // @ts-ignore
    partners: IManagementPartnerStore[];
}
export class ManagerAppState extends State<Manager> {
    activeTab: "update" | "staff" | "monitor";
    staffMembers: User[];
    newMember: User;
    store: ManagementStore;
    updatingStore: ManagementStore;
    foundPartnerStore?: IManagementPartnerStore;
    newPartnerStoreId?: number;
    numberOfVisitors?: number;
    lastUpdatedVisitors?: Date;
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
