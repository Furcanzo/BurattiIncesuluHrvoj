import {
    Customer,
    LineNumber,
    Store,
    LineNumberRequest,
    TimeSlot,
    Time,
    IServerLineNumberResponse,
    IServerCustomerRequest, IServerLineNumberRequest
} from "../models";
import {CustomerAppState} from "./models";
import {http} from "../effects";
import {State} from "../state";
import {Errored} from "../actions";
import {reqBookFutureLineNumber, reqETA, reqGetImmediateLineNumber, reqGetStoreList} from "../requests";
import {getCurrentTimeMillis, parseServerTimeSlot, serializeTimeSlotForServer, timeToMillis} from "../util";

export const INIT = (state: State<Customer>): CustomerAppState => {
    return {...state, newLineNumber: undefined, myLineNumbers: undefined};
}

const GET_LINE_NUMBERS = "lineNumbers";
export const GetLineNumbers = (state: CustomerAppState) => {
    // TODO: From Roberto
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

export const BookLineNumber = (state: CustomerAppState, previousErrored: boolean = false) => {
    const newLineNumber = new LineNumberRequest()
    newLineNumber.estimatedTimeOfVisit = new Time();
    newLineNumber.previousErrored = previousErrored;
    const success = (doneState, storeResponses) => {
        const emptyPartnerStores = storeResponses.map((storeResponse) => {
            return {
                ...storeResponse,
                location: {
                    lat: storeResponse.latitude,
                    lon: storeResponse.longitude,
                },
                workingHours: {} as any, // TODO When server changes
                timeoutMinutes: storeResponse.timeOut / 60 / 1000,
                maxCustomerCapacity: storeResponse.maxCustomers,
                partners: storeResponse.partnerStoreIds, // Partners will be populated once we have all the stores
            }
        }, );
        const stores: Store[] = emptyPartnerStores.map(emptyStore => {

            return {
                partners: emptyStore.partnerStoreIds.map((storeId:number): Store => emptyPartnerStores.find((store_) => store_.id === storeId)).filter(store => !!store),
                ... emptyStore,
            } as any;
        });
        return GotBookingStores(doneState, stores);

    };
    return [{
        ...state,
        newLineNumber,
        showDetailsOf: undefined,
        lineNumberReserved: undefined
    } as CustomerAppState, reqGetStoreList(success, Errored)]
}

export const GotBookingStores = (state: CustomerAppState, stores: Store[]): CustomerAppState => {
    return {newLineNumber: {...state.newLineNumber, potentialStores: stores}, ...state};
}

export const SelectStore = (store: Store) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store}};
}
// TODO: Implement immediate reservation,... sigh get ETA and then ask how much time they will spend
export const UnSelectStore = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store: undefined}};
}

export const ImmediatelyBook = (state: CustomerAppState) => {
    return [state, reqETA(ImmediateETARetrieved, ReservationFailed)];
}

export const ImmediateETARetrieved = (state: CustomerAppState, etaMilliseconds: number): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, etaMilliseconds}};
}

export const SubmitImmediateBooking = ({newLineNumber, ...rest}: CustomerAppState) => {
    const {start, end} = serializeTimeSlotForServer(newLineNumber.time);
    const success = (doneState, response: IServerLineNumberResponse) => {
        const reservedLN: LineNumber = {
            ...response,
            time: parseServerTimeSlot({start: response.from, end: response.until}),
            store: newLineNumber.potentialStores.find(store => store.id === response.store.id),
        }
        LineNumberReserved(doneState, reservedLN);
    };
    const lineNumber: IServerLineNumberRequest = {
        ...newLineNumber,
        from: start + newLineNumber.etaMilliseconds,
        until: start + newLineNumber.etaMilliseconds + timeToMillis(newLineNumber.estimatedTimeOfVisit),
        timeSlotId: newLineNumber.time.id,
        storeId: newLineNumber.store.id,

    }
    return [{newLineNumber, ...rest}, reqGetImmediateLineNumber(success, ReservationFailed, lineNumber)];
}
const GET_STORE_TIMESLOTS = (id: string) => `store/${id}/availableTimeSlots`;
export const SubmitStore = (state: CustomerAppState) => {

    return [state, http({
        path: GET_STORE_TIMESLOTS(state.newLineNumber.store.id.toString()), // TODO: wait for backend
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
    // TODO: Show the ETA during line number creation. // actually get it before confirmation
}

export const UnSelectTimeSlot = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, time: undefined, previousErrored: false}};
}
export const SendLineNumberRequest = (state: CustomerAppState) => {
    const {time, estimatedTimeOfVisit, etaMilliseconds, store} = state.newLineNumber;
    const success = (doneState, response: IServerLineNumberResponse) => {
        const reservedLN: LineNumber = {
            ...response,
            time: parseServerTimeSlot({start: response.from, end: response.until}),
            store: state.newLineNumber.potentialStores.find(store => store.id === response.store.id),
        }
        LineNumberReserved(doneState, reservedLN);
    }
    const from = getCurrentTimeMillis() + etaMilliseconds;
    const serverLineNumber: IServerLineNumberRequest = {
        from,
        until: from + timeToMillis(estimatedTimeOfVisit),
        storeId: store.id,
        timeSlotId: time.id,
    };
    return [state, reqBookFutureLineNumber(success, ReservationFailed, serverLineNumber)];
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
        return BookLineNumber(state, true);
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
