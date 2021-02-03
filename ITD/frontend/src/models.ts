import {CustomerAppState, customerComponent} from "./customer/models";
import {ManagerAppState, managerComponent} from "./manager/models";
import {ClerkAppState, clerkComponent} from "./clerk/models";
import {LoginAppState, loginComponent} from "./login/models";
import {createStoreComponent} from "./backoffice/models";
import {NewUser} from "./actions";
import {INavigatorItem, State, User} from "./state";



export class Manager extends User {
    constructor(readonly location: Store, readonly email: string) {
        super();
        this.userType = "manager";
    }
}


export class Clerk extends User {
    constructor(readonly location: Store, readonly email: string) {
        super();
        this.userType = "clerk";
    }
}


export class Customer extends User {
    name: string;
    surname: string;
    tel: string;
    lineNumbers: LineNumber[];
}

export class StoreLocation {
    constructor(readonly lat: number, readonly lon: number) {
    }
}

export class Time {
    hour: number;
    minute: number;
}

export class TimeSlot {
    start: Time;
    end: Time;
    day: Date; // Timeslots are retrieved from server (future lockdowns etc...)
}

export const emptyTimeSlot = () => {
    const slot = new TimeSlot();
    slot.day = new Date();
    slot.start = new Time();
    slot.start.hour = 0;
    slot.start.minute = 0;
    slot.end = new Time();
    slot.end.hour = 0;
    slot.end.minute = 0;
    return slot;
}

export enum TimeInterval {
    ONE_WEEK, ONE_MONTH, ONE_DAY
}

export class ReservationLimit {
    limit: number;
    interval: TimeInterval;
}

export class Store {
    readonly id?: string;
    location: StoreLocation;
    name: string;
    readonly openTimeSlots: TimeSlot[];
    workingHours: {
        start: Time;
        end: Time;
    };
    maxCustomerCapacity: number;
    partners: Store[];

}


export class AnonUser extends User {

}

export class BackOfficeUser extends User {

}


export class LineNumber {
    id: string;
    number: number;
    location: Store;
    time: TimeSlot;
}

export class LineNumberRequest {
    potentialStores: Store[];
    store: Store;
    potentialTimeSlots: TimeSlot[];
    selectedDateSlot?: Date;
    selectedWeekSlot?: Date;
    time: TimeSlot;
    estimatedTimeOfVisit: Time;
}



export const isManagerState = (state: State<User>): state is ManagerAppState => {
    return state.currentUser.userType === "manager";
}
export const isCustomerState = (state: State<User>): state is CustomerAppState => {
    return state.currentUser.userType === "customer";
}

export const isClerkState = (state: State<User>): state is ClerkAppState => {
    return state.currentUser.userType === "clerk";
}

export const isAnonState = (state: State<User>): state is LoginAppState => {
    return state.currentUser.userType === "anonymous";
}


const generateRoutes = (navigationItems: INavigatorItem[]) => {
    return navigationItems.reduce((acc, item): object => {
        acc[item.route] = {OnEnter: item.onEnter};
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

}
