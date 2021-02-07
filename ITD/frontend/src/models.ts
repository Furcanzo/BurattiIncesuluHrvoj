import {CustomerAppState, customerComponent} from "./customer/models";
import {ManagementStore, ManagerAppState, managerComponent} from "./manager/models";
import {ClerkAppState, clerkComponent} from "./clerk/models";
import {LoginAppState, loginComponent} from "./login/models";
import {CreateStoreAppState, createStoreComponent} from "./backoffice/models";
import {Logout, NewUser} from "./actions";
import {INavigatorItem, State, Store, Time, TimeSlot, User} from "./noImport";



export class Manager extends User {
    constructor(readonly store: ManagementStore, readonly email: string, readonly role: "manager" = "manager") {
        super();
    }
}


export class Clerk extends User {
    constructor(readonly store: ManagementStore, readonly email: string, readonly role: "clerk" = "clerk") {
        super();
    }
}

export interface IServerEmployeeResponse {
    id: number;
    email: string;
    role: string;
    store: Store;
}

export interface IServerEmployeeRequest {
    email: string;
    role: string;
    storeId: number;
}
export class Customer extends User {
    constructor(readonly role:"customer"="customer") {
        super();
    }
    name: string;
    surname: string;
    tel: string;
}

export interface IServerCustomerRequest {
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
}
export interface IServerCustomerResponse extends IServerCustomerRequest {
    id: number;
}


export interface IServerWorkingHourRequest {
    from: number;
    until: number;
}
export interface IServerWorkingHourResponse extends IServerWorkingHourRequest {
    id: number;
}

export interface IServerStoreRequest {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    maxCustomers: number;
    partnerStoreIds: number[];
    timeOut: number;
    workingHour?: IServerWorkingHourRequest;
    workingHourDTO: IServerWorkingHourResponse;

}


export class AnonUser extends User {

}

export class BackOfficeUser extends User {

}


export class LineNumber {
    id: number;
    number: number;
    store: Store;
    time: TimeSlot;
    status?: string;
}

export class LineNumberRequest {
    potentialStores: Store[];
    store: Store;
    potentialTimeSlots: TimeSlot[];
    selectedDateSlot?: Date;
    selectedWeekSlot?: Date;
    time: TimeSlot | null; // null indicates immediate
    estimatedTimeOfVisit: Time;
    etaMilliseconds?: number;
    previousErrored: boolean;
}

export interface IServerTimeSlot {
    startTime: number;
    endTime: number;
}
export interface IServerStoreResponse extends IServerStoreRequest {
    id: number;
    partnerStores: Store[];
    workingHourDTO: IServerWorkingHourResponse;
}

export interface IServerLineNumberResponse {
    id: number;
    status: string;
    number: number;
    from: number;
    until: number;
    timeSlot: IServerTimeSlot;
    store: IServerStoreResponse;
    customer: IServerCustomerResponse;
}

export interface IServerLineNumberRequest {
    from: number;
    until: number;
    timeSlotId: number;
    storeId: number;
}

export const isManagerState = (state: State<User>): state is ManagerAppState => {
    return state.currentUser.role === "manager";
}
export const isCustomerState = (state: State<User>): state is CustomerAppState => {
    return state.currentUser.role === "customer";
}

export const isClerkState = (state: State<User>): state is ClerkAppState => {
    return state.currentUser.role === "clerk";
}

export const isAnonState = (state: State<User>): state is LoginAppState => {
    return state.currentUser.role === "anonymous";
}

export const isBackOfficeState = (state: State<BackOfficeUser>): state is CreateStoreAppState => {
    return state.currentUser.role === "backoffice";
}


const generateRoutes = (navigationItems: INavigatorItem[]) => {
    return navigationItems.reduce((acc, item): object => {
        acc[item.route] = {load: item.onEnter}; // {OnEnter: item.onEnter};
        return acc;
    }, {})
}
export const routes = {
    ...generateRoutes(managerComponent.navigation),
    ...generateRoutes(clerkComponent.navigation),
    ...generateRoutes(loginComponent.navigation),
    ...generateRoutes(createStoreComponent.navigation),
    ...generateRoutes(customerComponent.navigation),

    "/": (state: State<any>) => NewUser(state, state.currentUser),
    "/logout": {OnEnter: Logout}

}

export interface IServerMonitorResponse {
    timestamp: number;
    customersInStore: number;
    storeId: number;
}
