import {Component, INavigatorItem, Manager, State, Store, TimeSlot, User} from "../models";
import {INIT, LoadMonitoringTab, LoadStaffTab} from "./actions";
import {row, text} from "../widgets";

export class ManagerAppState extends State<Manager> {
    activeTab: "update" | "staff" | "monitor";
    staffMembers: User[];
    newMember: User;
    store: Store;
    updatingStore: Store;
    newTimeSlot?: TimeSlot;
}

const navigationItems: INavigatorItem[] = [{
    title: "Update Store",
    isDefault: false,
    route: () => {},
}, {
    title: "Manage Staff",
    isDefault: false,
    route: LoadStaffTab,
}, {
    title: "Monitor",
    isDefault: true,
    route: LoadMonitoringTab
}].reverse();

export const managerComponent = new Component((state) => row(text("TODO")), INIT, navigationItems);
