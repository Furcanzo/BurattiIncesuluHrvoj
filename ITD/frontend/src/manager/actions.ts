import {emptyTimeSlot, Manager, State, Store, StoreLocation, TimeSlot, User} from "../models";
import {ManagerAppState} from "./models";
import {http} from "../effects";
import {timeSlotEq} from "../util";

export const INIT = (state: State<Manager>): ManagerAppState => {
    return {
        ...state,
        activeTab: "monitor",
        updatingStore: undefined,
        store: state.currentUser.location,
        staffMembers: [],
        newMember: undefined,
        newTimeSlot: undefined,
    };
}

const MONITOR_PATH = "monitor"
export const LoadMonitoringTab = (state: ManagerAppState) => {
    return [{...state, activeTab: "monitor"} as ManagerAppState, http({
        path: MONITOR_PATH,
        method: "GET",
        resultAction: MonitoringLoaded,
        errorAction: INIT,
    })]
};
export const MonitoringLoaded = (state: ManagerAppState, monitoringData: any) => {
    return state; // TODO: How to load and display monitoring
}
const Error = (state: ManagerAppState) => {
    return state;
}
const GET_STAFF_LIST = "staff/list";
export const LoadStaffTab = (state: ManagerAppState) => {
    return [{...state, activeTab: "staff", newMember: new Manager(state.store, "")} as ManagerAppState, http({
        path: GET_STAFF_LIST,
        method: "GET",
        resultAction: StaffListLoaded,
        errorAction: Error,
    })]
}
export const StaffListLoaded = (state: ManagerAppState, staffMembers: User[]): ManagerAppState => {
    return {...state, staffMembers};
}

export const UpdateNewMemberEmail = (state: ManagerAppState, ev: InputEvent): ManagerAppState => {
    return {...state, newMember: {...state.newMember, email: (ev.target as HTMLInputElement).value}};
}

export const SetNewMemberAs = (as: "manager" | "clerk") => (state: ManagerAppState) => {
    return {...state, newMember: {...state.newMember, userType: as}};
}

const CREATE_STAFF = "staff/create";
export const SubmitNewMember = (state: ManagerAppState) => {
    return [state, http({
        path: CREATE_STAFF,
        method: "POST",
        resultAction: (state, _) => LoadStaffTab(state) as any,
        errorAction: Error,
    })]
}
const CHANGE_STAFF_TYPE = "staff/toggle";
export const ChangeStaffType = (state: ManagerAppState) => {
    return [state, http({
        path: CHANGE_STAFF_TYPE,
        method: "POST",
        resultAction: (state, _) => LoadStaffTab(state) as any,
        errorAction: Error,
    })]
}

const DELETE_STAFF = "staff/delete";
export const DeleteStaff = (state: ManagerAppState) => {
    return [state, http({
        path: DELETE_STAFF,
        method: "POST",
        resultAction: (state, _) => LoadStaffTab(state) as any,
        errorAction: Error,
    })]
};

export const LoadUpdateStoreTab = (state: ManagerAppState): ManagerAppState => {
    return {...state, updatingStore: {...state.store}, activeTab: "update"};
}

const UPDATE_STORE = "store/update";
export const SaveStore = (state: ManagerAppState) => {
    return [state, http({
        path: UPDATE_STORE,
        method: "POST",
        resultAction: StoreUpdated,
        errorAction: Error,
    })]
};

export const StoreUpdated = (state: ManagerAppState) => {
    state.currentUser = {...state.currentUser, location: state.updatingStore};
    return LoadUpdateStoreTab(state);
}

export const UpdateTimeSlotTime = (part: "hour" | "minute", of: "start" | "end") =>
    (state: ManagerAppState, ev: Event) => {
        const newVal: number = Number.parseInt((ev.target as HTMLInputElement).value);
        if (!Number.isNaN(newVal)) {
            state.newTimeSlot[of][part] = newVal;
        }
        return state;
    }

export const UpdateTimeSlotDate = (state: ManagerAppState, date: Date) => {
    state.newTimeSlot.day = date;
    return state;
}

export const AddNewTimeSlot = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            openTimeSlots: [...state.updatingStore.openTimeSlots, state.newTimeSlot]
        },
        newTimeSlot: emptyTimeSlot()
    }
}

export const RemoveTimeSlot = (state: ManagerAppState, targetSlot: TimeSlot): ManagerAppState => {
    return {
        ...state, updatingStore: {
            ...state.updatingStore,
            openTimeSlots: state.updatingStore.openTimeSlots.filter(slot => !timeSlotEq(slot, targetSlot)),
        }
    };
}
export const UpdateLocation = (state: ManagerAppState, location: StoreLocation) => {
    return {
        ...state, updatingStore: {
            ...state.updatingStore,
            location,
        }
    }
} // TODO: How to trigger this from maps.

export const UpdateStoreName = (state: ManagerAppState, ev: Event): ManagerAppState=> {
    const newName = (ev.target as HTMLInputElement).value;
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            name: newName,
        }
    }
}

export const UpdateStoreCapacity = (state: ManagerAppState, ev: Event): ManagerAppState => {
    const newValue = Number.parseInt((ev.target as HTMLInputElement).value);
    if (!Number.isNaN(newValue)) {
        state.updatingStore.maxCustomerCapacity = newValue;
    }
    return state;
}
