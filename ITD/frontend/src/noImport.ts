export class User {
    id?: number;
    email: string;
    role: "manager" | "clerk" | "customer" | "anonymous" | "backoffice";
}
export abstract class State<U extends User> {
    currentUser?: U;
    loading: boolean;
    error?: {
        recoverable?: boolean;
        text?: string;
    };
}
export interface INavigatorItem {
    title: string;
    route: string;
    isDefault: boolean;
    onEnter: (state) => any;
}

export class Component<ComponentState extends State<U>, U extends User> {
    constructor(readonly view: (componentState: ComponentState) => any, readonly initAction: (state: State<U>) => ComponentState, readonly navigation: INavigatorItem[]) {
    }
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
    id: number;
    start: Time;
    end: Time;
    day: Date; // Timeslots are retrieved from server (future lockdowns etc...)
}

export class Store {
    readonly id?: number;
    location: StoreLocation;
    name: string;
    workingHours: TimeSlot; // Ignore date value
    timeoutMinutes: number;
    maxCustomerCapacity: number;
    partners: Store[];
    description: string;

}
