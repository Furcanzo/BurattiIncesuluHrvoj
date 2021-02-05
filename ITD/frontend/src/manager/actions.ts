import {Manager, Store, StoreLocation} from "../models";
import {ManagerAppState} from "./models";
import {http, timeout} from "../effects";
import {Crashed, Errored} from "../actions";
import {State, User} from "../state";

export const INIT = (state: State<Manager>): ManagerAppState => {
    return {
        ...state,
        activeTab: "monitor",
        updatingStore: undefined,
        store: state.currentUser.location,
        staffMembers: [],
        newMember: undefined,
        newPartnerStoreId: "",
    };
}

export const MonitoringLoaded = (state: ManagerAppState, {customerCount}: {customerCount: number}) => {
    return [{...state, numberOfVisitors: customerCount} as ManagerAppState, timeout({seconds: 5, action: RefreshMonitoringData})];
}

const MONITOR_PATH = "monitor"
const monitorRequest = (showResults) => http({
    path: MONITOR_PATH,
    method: "GET",
    resultAction: MonitoringLoaded as any,
    errorAction: Crashed,
    showScreenWhileLoading: showResults,
});
export const LoadMonitoringTab = (state: ManagerAppState) => {
    return [{...state, activeTab: "monitor"} as ManagerAppState, monitorRequest(false)]
};

export const RefreshMonitoringData = (state: ManagerAppState) => {
    if (state.activeTab !== "monitor") {
        return state;
    }
    return [state, monitorRequest(true)];

}
const GET_STAFF_LIST = "staff/list";
export const LoadStaffTab = (state: ManagerAppState) => {
    return [{...state, activeTab: "staff", newMember: new Manager(state.store, "")} as ManagerAppState, http({
        path: GET_STAFF_LIST,
        method: "GET",
        resultAction: StaffListLoaded,
        errorAction: Crashed,
    })]
}
export const StaffListLoaded = (state: ManagerAppState, staffMembers: User[]): ManagerAppState => {
    return {...state, staffMembers};
}

export const UpdateNewMemberEmail = (state: ManagerAppState, content: string): ManagerAppState => {
    return {...state, newMember: {...state.newMember, email: content}};
}

export const SetNewMemberAs = (as: "manager" | "clerk") => (state: ManagerAppState) => {
    return {...state, newMember: {...state.newMember, userType: as}};
}

const CREATE_STAFF = "staff/create";
export const SubmitNewMember = (state: ManagerAppState) => {
    return [state, http({
        path: CREATE_STAFF,
        method: "POST",
        resultAction: (state: ManagerAppState, _) => LoadStaffTab(state) as any,
        errorAction: Errored,
    })]
}
const CHANGE_STAFF_TYPE = "staff/toggle";
export const ChangeStaffType = (state: ManagerAppState) => {
    return [state, http({
        path: CHANGE_STAFF_TYPE,
        method: "POST",
        resultAction: (state: ManagerAppState, _) => LoadStaffTab(state) as any,
        errorAction: Errored,
    })]
}

const DELETE_STAFF = "staff/delete";
export const DeleteStaff = (state: ManagerAppState) => {
    // Prevent delete thyself // TODO: Deleting will not be implemented
    return [state, http({
        path: DELETE_STAFF,
        method: "POST",
        resultAction: (state:ManagerAppState, _) => LoadStaffTab(state) as any,
        errorAction: Errored,
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
        errorAction: Errored,
    })]
};

export const StoreUpdated = (state: ManagerAppState) => {
    state.currentUser = {...state.currentUser, location: state.updatingStore};
    return LoadUpdateStoreTab(state);
}

export const UpdateStoreOpeningHours = (part: "hour" | "minute", of: "start" | "end") =>
    (state: ManagerAppState, content: string) => {
        const newVal: number = Number.parseInt(content);
        if (!Number.isNaN(newVal)) {
            state.updatingStore.workingHours[of][part] = newVal;
        }
        return state;
    }

export const UpdateLocation = (state: ManagerAppState, location: StoreLocation) => {
    return {
        ...state, updatingStore: {
            ...state.updatingStore,
            location,
        }
    }
}

export const UpdateStoreName = (state: ManagerAppState, newName: string): ManagerAppState => {
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            name: newName,
        }
    }
}

export const UpdateStoreCapacity = (state: ManagerAppState, content: string): ManagerAppState => {
    const newValue = Number.parseInt(content);
    if (!Number.isNaN(newValue)) {
        state.updatingStore.maxCustomerCapacity = newValue;
    }
    return state;
}

export const UpdatePartnerStoreId = (state: ManagerAppState, content: string): ManagerAppState => {
    return {...state, newPartnerStoreId: content};
}
const GET_STORE = (id: string) => `store/${id}`
export const FindPartnerStore = (state: ManagerAppState) => {
    return [state, http({
        path: GET_STORE(state.newPartnerStoreId),
        method: "GET",
        resultAction: PartnerStoreRetrieved,
        errorAction: Errored,
    })]
}

export const PartnerStoreRetrieved = (state: ManagerAppState, partnerStore: Store): ManagerAppState => {
    return {...state, foundPartnerStore: partnerStore};
}

export const AddNewPartnerStore = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        foundPartnerStore: undefined,
        newPartnerStoreId: "",
        updatingStore: {...state.updatingStore, partners: [...state.updatingStore.partners, state.foundPartnerStore]}
    }
};

export const CancelPartnerStoreAddition = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        foundPartnerStore: undefined,

    };
};

export const RemovePartnerStore = (partnerStore: Store) => (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            partners: state.updatingStore.partners.filter(store => store.id === partnerStore.id),
        }
    }
}


// TODO: Update timeout
// TODO: Add weekday to the working hours
