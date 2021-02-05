import {Customer, LineNumber, Store, LineNumberRequest, TimeSlot, Time} from "../models";
import {CustomerAppState} from "./models";
import {http} from "../effects";
import {State} from "../state";
import {Errored} from "../actions";

export const INIT = (state: State<Customer>): CustomerAppState => {
    return {...state, newLineNumber: undefined, myLineNumbers: undefined};
}

const GET_LINE_NUMBERS = "lineNumbers";
export const GetLineNumbers = (state: CustomerAppState) => {
    return [{
        ...state,
        showDetailsOf: undefined,
        lineNumberReserved: undefined,
        newLineNumber: undefined,
        myLineNumbers: []
    } as CustomerAppState, http({
        path: GET_LINE_NUMBERS,
        method: "GET",
        errorAction: Errored,
        resultAction: GotLineNumbers,
    })];
}

export const GotLineNumbers = (state: CustomerAppState, lineNumbers: LineNumber[]): CustomerAppState => {
    return {myLineNumbers: lineNumbers, ...state};
}

const GET_OPEN_STORES = "stores"

export const BookLineNumber = (state: CustomerAppState) => {
    const newLineNumber = new LineNumberRequest()
    newLineNumber.estimatedTimeOfVisit = new Time();
    newLineNumber.previousErrored = false;
    return [{
        ...state,
        newLineNumber,
        showDetailsOf: undefined,
        lineNumberReserved: undefined
    } as CustomerAppState, http({
        path: GET_OPEN_STORES,
        method: "GET",
        errorAction: Errored,
        resultAction: GotBookingStores
    })]
}

export const GotBookingStores = (state: CustomerAppState, stores: Store[]): CustomerAppState => {
    return {newLineNumber: {...state.newLineNumber, potentialStores: stores}, ...state};
}

export const SelectStore = (store: Store) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store}};
}

export const UnSelectStore = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store: undefined}};
}
const GET_STORE_TIMESLOTS = (id: string) => `store/${id}/availableTimeSlots`;
export const SubmitStore = (state: CustomerAppState) => {
    return [state, http({
        path: GET_STORE_TIMESLOTS(state.newLineNumber.store.id),
        method: "GET",
        resultAction: StoreTimeSlotsRetrieved,
        errorAction: ReservationFailed,

    })]
}
export const StoreTimeSlotsRetrieved = (state: CustomerAppState, timeSlots: TimeSlot[]): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, potentialTimeSlots: timeSlots}};
}

export const UpdateVisitTimeField = (field: "hour" | "minute") => (state: CustomerAppState, content: string): CustomerAppState => {
    const numVal = Number.parseInt(content);
    const newState = {...state};
    if (!Number.isNaN(numVal)) {
        newState.newLineNumber.estimatedTimeOfVisit[field] = numVal;
    }
    return newState;
}

export const SelectTimeSlot = (timeSlot: TimeSlot) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, time: timeSlot, previousErrored: false}};
    // TODO: Show the ETA during line number creation.
}

export const UnSelectTimeSlot = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, time: undefined, previousErrored: false}};
}
const RESERVE_TIMESLOT_OF = (id: string) => `store/${id}/reserve`;
export const SendLineNumberRequest = (state: CustomerAppState) => {
    const {time, estimatedTimeOfVisit, ...rest} = state.newLineNumber;
    return [state, http({
        path: RESERVE_TIMESLOT_OF(state.newLineNumber.store.id),
        method: "POST",
        body: {time, estimatedTimeOfVisit},
        resultAction: LineNumberReserved,
        errorAction: ReservationFailed,
    })]
}

export const ReservationFailed = (state: CustomerAppState, text?: string) => {
    if (text === "Maximum capacity reached") {
        return SubmitStore({
            ...state,
            newLineNumber: {
                ...state.newLineNumber,
                time: undefined,
                potentialTimeSlots: undefined,
                previousErrored: true
            }
        });
    }
    if (text === "Store not available") {
        return BookLineNumber(state);
    }
    return Errored(state, text);
}
export const LineNumberReserved = (state: CustomerAppState, lineNumber: LineNumber): CustomerAppState => {
    return {...state, lineNumberReserved: lineNumber, newLineNumber: undefined};
}

export const ShowDetailsOf = (lineNumber: LineNumber) => (state: CustomerAppState): CustomerAppState => {
    return {...state, showDetailsOf: lineNumber};
};

export const UnSelectDetails = (state: CustomerAppState): CustomerAppState => {
    return {...state, showDetailsOf: undefined};
}
export const SelectDayOfTimeSlot = (date: Date) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, selectedDateSlot: date, previousErrored: false}};
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
export const NextWeek = (state: CustomerAppState): CustomerAppState => {
    return {
        ...state,
        newLineNumber: {
            ...state.newLineNumber,
            selectedWeekSlot: setWeek(state.newLineNumber.selectedWeekSlot, true),
            previousErrored: false
        }
    }
}

export const PrevWeek = (state: CustomerAppState): CustomerAppState => {
    return {
        ...state,
        newLineNumber: {
            ...state.newLineNumber,
            selectedWeekSlot: setWeek(state.newLineNumber.selectedWeekSlot, false),
            previousErrored: false
        }
    };
}
