import {Customer, LineNumber, Store, LineNumberRequest, TimeSlot, Time} from "../models";
import {CustomerAppState} from "./models";
import {http} from "../effects";
import {State} from "../state";

export const INIT = (state: State<Customer>): CustomerAppState => {
    return {...state, newLineNumber: undefined, myLineNumbers: undefined};
}

const GET_LINE_NUMBERS = "lineNumbers";
export const GetLineNumbers = (state: CustomerAppState) => {
    return [{...state, showDetailsOf: undefined, lineNumberReserved: undefined, myLineNumbers: []} as CustomerAppState, http({path: GET_LINE_NUMBERS, method: "GET", errorAction: INIT, resultAction: GotLineNumbers})]
}

export const GotLineNumbers = (state: CustomerAppState, lineNumbers: LineNumber[]): CustomerAppState => {
    return {myLineNumbers: lineNumbers, ...state};
}
const GET_OPEN_STORES = "stores"

export const BookLineNumber = (state: CustomerAppState) => {
    const newLineNumber = new LineNumberRequest()
    newLineNumber.estimatedTimeOfVisit = new Time();
    return [{...state, newLineNumber, showDetailsOf: undefined, lineNumberReserved: undefined} as CustomerAppState, http({
        path: GET_OPEN_STORES,
        method: "GET",
        errorAction: INIT,
        resultAction: GotBookingStores
    })]
}

export const GotBookingStores = (state: CustomerAppState, stores: Store[]): CustomerAppState => {
    return {newLineNumber: {...state.newLineNumber, potentialStores: stores}, ...state};
}

const GET_STORE_TIMESLOTS = (id: string) => `store/${id}/availableTimeSlots`;
export const SelectStore = (store: Store) => (state: CustomerAppState) => {
    return [{...state, newLineNumber: {...state.newLineNumber, store}} as CustomerAppState, http({
        path: GET_STORE_TIMESLOTS(store.id),
        method: "GET",
        resultAction: StoreTimeSlotsRetrieved,
        errorAction: INIT,

    })]
}
export const StoreTimeSlotsRetrieved = (state: CustomerAppState, timeSlots: TimeSlot[]): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, potentialTimeSlots: timeSlots}};
}

export const UpdateVisitTimeField = (field: "hour" | "minute") => (state: CustomerAppState, content: string): CustomerAppState => {
    const numVal = Number.parseInt(content);
    if (!Number.isNaN(numVal)) {
        state.newLineNumber.estimatedTimeOfVisit[field] = numVal;
    }
    return state;
}

export const SelectTimeSlot = (timeSlot: TimeSlot) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, time: timeSlot}};
}

const RESERVE_TIMESLOT_OF = (id: string) => `store/${id}/reserve`;
export const SendLineNumberRequest = (state: CustomerAppState) => {
    const {time, estimatedTimeOfVisit, ...rest} = state.newLineNumber;
    return [state, http({
        path: RESERVE_TIMESLOT_OF(state.newLineNumber.store.id),
        method: "POST",
        body: {time, estimatedTimeOfVisit},
        resultAction: LineNumberReserved,
        errorAction: INIT,
    })]
}

export const LineNumberReserved = (state: CustomerAppState, lineNumber: LineNumber): CustomerAppState => {
    return  {...state, lineNumberReserved: lineNumber, newLineNumber: undefined};
}

export const ShowDetailsOf = (lineNumber: LineNumber) => (state: CustomerAppState): CustomerAppState => {
    return {...state, showDetailsOf: lineNumber};
};

export const SelectDayOfTimeSlot = (date: Date) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, selectedDateSlot: date}};
}

const setWeek = (current: Date, next: boolean) => {
    const month = current.getUTCMonth();
    let days;
    switch (month) {
        case 0: // January
        case 2: // March
        case 4: // May
        case 6: // July
        case 7: // August
        case 9: // October
        case 11: // December
            days = 31;
            break;
        case 1:
            days = 28;
            break;
        default:
            days = 30;
    }
    let currentDay = current.getUTCDate();
    currentDay += next ? 7 : -7;
    if (currentDay <= 0) {
        currentDay += days;
    }
    if (currentDay > days) {
        currentDay -= days;
    }
    const newDate = new Date(current);
    newDate.setDate(currentDay);
    return newDate;
}
export const NextWeek = (state: CustomerAppState):CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, selectedWeekSlot: setWeek(state.newLineNumber.selectedWeekSlot, true)}}
}

export const PrevWeek = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, selectedWeekSlot: setWeek(state.newLineNumber.selectedWeekSlot, false)}};
}
