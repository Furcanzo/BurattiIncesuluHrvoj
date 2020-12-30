import {
    Customer,
    LineNumber,
    LineNumberRequest,
    NewUser,
    Shop,
    Time,
    TimeInterval,
    TimeSlot,
    UserCredentials
} from "../src/models";
import {NavigationItem} from "../src/widgets";
import {Nothing} from "../src/actions";

export const dates = [22, 23, 24, 25, 26, 27, 28].map(day => new Date(2020, 11, day));
export const times: Time[] = [
    {hour: 12, minute: 0},
    {hour: 12, minute: 30},
    {hour: 13, minute: 0},
    {hour: 13, minute: 30},
    {hour: 14, minute: 0},
];
export const timeSlots: TimeSlot[] = [0, 1, 2, 3].map((ind) => {
    return {start: times[ind], end: times[ind + 1], day: dates[0]};
});
export const bakery: Shop = {
    openTimeSlots: timeSlots,
    location: {lat: 3, lon: 3},
    maxCustomerCapacity: 30,
    name: "Bakery",
    reservationLimit: {limit: 3, interval: TimeInterval.ONE_DAY},
    timeout: 30,
    productCategories: [
        {name: "Breads", location: null, id: 1},
        {name: "Pasteries", location: null, id: 2},
        {name: "Snacks", location: null, id: 3},
        {name: "Drinks", location: null, id: 4}
    ]
}

export const restaurant: Shop = {
    openTimeSlots: timeSlots,
    location: {lat: 5, lon: 3},
    maxCustomerCapacity: 50,
    name: "Restaurant",
    reservationLimit: {limit: 2, interval: TimeInterval.ONE_DAY},
    timeout: 45,
    productCategories: [],
}
export const lineNumberRequest: LineNumberRequest = {
    location: bakery,
    productCategories: [bakery.productCategories[1], bakery.productCategories[2]],
    time: timeSlots[0],
    estimatedTimeOfVisit: {hour: 0, minute: 15},
}

export const newUser: NewUser = {
    name: "John",
    surname: "Doe",
    tel: "3513546767",
    email: "john.doe@example.com",
    password: "asd-1234"
};

export const loginUser: UserCredentials = {
    ...newUser
}

export const lineNumbers: LineNumber[] = [
    {location: bakery, id: "asd", number: 15, time: bakery.openTimeSlots[0]},
    {location: restaurant, id: "asd", number: 56, time: bakery.openTimeSlots[3]}
]

export const customer: Customer = {
    ...newUser,
    lineNumbers: [],
}

export const clerkNavigation: NavigationItem[] = [
    {active: false, title: "Scan QR", onClick: Nothing},
    {active: false, title: "Generate QR", onClick: Nothing},
]

export const managerNavigation: NavigationItem[] = [
    {active: false, title: "Monitor", onClick: Nothing},
    {active: false, title: "Store Details", onClick: Nothing},
    {active: false, title: "Manage Users", onClick: Nothing},
    {active: false, title: "System Stop", onClick: Nothing},

]

export const customerNavigation: NavigationItem[] = [
    {active: false, title: "My Tickets", onClick: Nothing},
    {active: false, title: "Reserve", onClick: Nothing},
];
