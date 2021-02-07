import {
    Customer,
    LineNumber,
    LineNumberRequest,
    IServerLineNumberResponse,
    IServerLineNumberRequest, IServerTimeSlot, IServerStoreResponse
} from "../models";
import {CustomerAppState} from "./models";
import {State, Store, Time, TimeSlot} from "../noImport";
import {Errored} from "../actions";
import {
    reqBookFutureLineNumber,
    reqETA,
    reqGetImmediateLineNumber,
    reqGetStoreList,
    reqListLineNumbers, reqListTimeSlotsOf
} from "../requests";
import {getCurrentTimeMillis, parseServerTimeSlot, serializeTimeSlotForServer, timeToMillis} from "../util";

export const INIT = (state: State<Customer>): CustomerAppState => {
    return {...state, newLineNumber: undefined, myLineNumbers: undefined};
}

export const GetLineNumbers = (state: CustomerAppState) => {
    return [{
        ...state,
        showDetailsOf: undefined,
        lineNumberReserved: undefined,
        newLineNumber: undefined,
        myLineNumbers: []
    } as CustomerAppState, reqListLineNumbers(GotLineNumbers, Errored)];
}

export const GotLineNumbers = (state: CustomerAppState, serverLineNumbers: IServerLineNumberResponse[]): CustomerAppState => {
    const lineNumbers: LineNumber[] = serverLineNumbers.map((serverLineNumber): LineNumber => {
        return {
            ...serverLineNumber,
            time: parseServerTimeSlot({startTime: serverLineNumber.from, endTime: serverLineNumber.until, id: 0}),
            store: {
                ...serverLineNumber.store,
                location: {
                    lat: serverLineNumber.store.latitude,
                    lon: serverLineNumber.store.longitude,
                }
            } as any as Store, // We don't need the other fields in the views.
        }
    })
    return {...state, myLineNumbers: lineNumbers};
}


export const BookLineNumber = (state: CustomerAppState, previousErrored: boolean = false) => {
    const newLineNumber = new LineNumberRequest()
    newLineNumber.estimatedTimeOfVisit = new Time();
    newLineNumber.previousErrored = previousErrored;
    const success = (doneState, storeResponses) => {
        const stores: Store[] = storeResponses.map((storeResponse: IServerStoreResponse) => {
            return {
                ...storeResponse,
                location: {
                    lat: storeResponse.latitude,
                    lon: storeResponse.longitude,
                },
                workingHours: {
                    from: {hour: storeResponse.workingHour.from, minute: 0},
                    until: {hour: storeResponse.workingHour.until, minute: 0},
                    id: (storeResponse.workingHour as any).id,
                },
                timeoutMinutes: storeResponse.timeOut / 60 / 1000,
                maxCustomerCapacity: storeResponse.maxCustomers,
            }
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
    return {...state, newLineNumber: {...state.newLineNumber, potentialStores: stores}};
}

export const SelectStore = (store: Store) => (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store}};
}
export const UnSelectStore = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, store: undefined}};
}

const convertLineNumberRequest = (newLineNumber: LineNumberRequest): IServerLineNumberRequest => {
    const {startTime, endTime} = newLineNumber.time ? serializeTimeSlotForServer(newLineNumber.time) : {startTime: getCurrentTimeMillis(), endTime: getCurrentTimeMillis()};
    return {
        from: startTime + (newLineNumber.etaMilliseconds || 0),
        until: startTime + (newLineNumber.etaMilliseconds || 0) + timeToMillis(newLineNumber.estimatedTimeOfVisit),
        timeSlotId: newLineNumber.time?.id || null,
        storeId: newLineNumber.store.id,
    }
}

export const ImmediatelyBook = (state: CustomerAppState) => {
    const newLineNumber = state.newLineNumber;
    const serverRequest: IServerLineNumberRequest = {
        from: getCurrentTimeMillis(),
        until: getCurrentTimeMillis() + newLineNumber.store.timeoutMinutes * 60 * 1000,
        timeSlotId: null,
        storeId: newLineNumber.store.id,
    }
    return [{
        ...state,
        newLineNumber: {...state.newLineNumber, time: null}
    } as CustomerAppState, reqETA(ETARetrieved, ReservationFailed, serverRequest)];
}

export const ETARetrieved = (state: CustomerAppState, etaMilliseconds: {etaMilliseconds: number}) => {
    return {...state, newLineNumber: {...state.newLineNumber, etaMilliseconds: etaMilliseconds.etaMilliseconds}};
}

export const SubmitImmediateBooking = ({newLineNumber, ...rest}: CustomerAppState) => {
    const success = (doneState, response: IServerLineNumberResponse) => {
        const reservedLN: LineNumber = {
            ...response,
            time: parseServerTimeSlot({startTime: response.from, endTime: response.until, id: 0}),
            store: newLineNumber.potentialStores.find(store => store.id === response.store.id),
        }
        return LineNumberReserved(doneState, reservedLN);
    };
    const lineNumber: IServerLineNumberRequest = convertLineNumberRequest(newLineNumber);
    return [{newLineNumber, ...rest}, reqGetImmediateLineNumber(success, ReservationFailed, lineNumber)];
}

export const SubmitStore = (state: CustomerAppState) => {
    return [state, reqListTimeSlotsOf(StoreTimeSlotsRetrieved, ReservationFailed, state.newLineNumber.store.id)];
}
export const StoreTimeSlotsRetrieved = (state: CustomerAppState, timeSlots: IServerTimeSlot[]): CustomerAppState => {
    const immediate: CustomerAppState = {
        ...state,
        newLineNumber: {...state.newLineNumber, potentialTimeSlots: timeSlots.map(parseServerTimeSlot)}
    };
    return {
        ...immediate,
        newLineNumber: {...immediate.newLineNumber, selectedWeekSlot: immediate.newLineNumber.potentialTimeSlots[0].day}
    }
}

export const UpdateVisitTimeField = (field: "hour" | "minute") => (state: CustomerAppState, content: string) => {
    const numVal = Number.parseInt(content);
    const newState = {...state};
    if (!content) {
        newState.newLineNumber.estimatedTimeOfVisit[field] = null;
    }
    if (!Number.isNaN(numVal)) {
        newState.newLineNumber.estimatedTimeOfVisit[field] = numVal;
    }
    return newState;
}

export const SelectTimeSlot = (timeSlot: TimeSlot) => (state: CustomerAppState) => {
    const newState = {
        ...state,
        newLineNumber: {...state.newLineNumber, time: timeSlot, previousErrored: false, estimatedTimeOfVisit: {hour: 0, minute: 30}} as LineNumberRequest,

    }
    return newState;
}

export const UnSelectTimeSlot = (state: CustomerAppState): CustomerAppState => {
    return {...state, newLineNumber: {...state.newLineNumber, time: undefined, previousErrored: false}};
}
export const SendLineNumberRequest = (state: CustomerAppState) => {
    const {time, estimatedTimeOfVisit, store} = state.newLineNumber;
    const success = (doneState, response: IServerLineNumberResponse) => {
        const reservedLN: LineNumber = {
            ...response,
            time: parseServerTimeSlot({startTime: response.from, endTime: response.until, id: 0}),
            store: state.newLineNumber.potentialStores.find(store => store.id === response.store.id),
        }
        return LineNumberReserved(doneState, reservedLN);
    }
    const from = time ? serializeTimeSlotForServer(time).startTime : getCurrentTimeMillis();
    const serverLineNumber: IServerLineNumberRequest = {
        from,
        until: from + timeToMillis(estimatedTimeOfVisit),
        storeId: store.id,
        timeSlotId: time?.id,
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
    return {...state, lineNumberReserved: lineNumber};
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
