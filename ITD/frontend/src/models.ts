export class User {
    email: string;
    name: string;
    surname: string;
    tel: string;
}

export class Manager extends User {
    location: Shop;
}

export class Clerk extends User {
    location: Shop;
}

export class Customer extends User {
    lineNumbers: LineNumber[];
}

export class ShopLocation {
    lat: number;
    lon: number;
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

export enum TimeInterval {
    ONE_WEEK, ONE_MONTH,ONE_DAY
}
export class ReservationLimit {
    limit: number;
    interval: TimeInterval;
}
export class Shop {
    location: ShopLocation;
    name: string;
    openTimeSlots: TimeSlot[];
    timeout: number;
    maxCustomerCapacity: number;
    reservationLimit: ReservationLimit;
    products: Product[];

}

export class UserCredentials {
    email: string;
    password: string;
}

export class NewUser extends User {
    password: string;
}
export class Product {
    location: any; // TODO: How to represent product location? Actually do we need this on client side?
    name: string;
}

export class LineNumber {
    id: string;
    number: number;
    location: Shop;
    time: TimeSlot;
}

export class LineNumberRequest {
    products?: Product[];
    location: Shop;
    time: TimeSlot;
    estimatedTimeOfVisit: Time;
}
