import {
    IServerEmployeeRequest,
    IServerMonitorResponse, IServerStoreRequest,
    IServerStoreResponse,
    Manager,
    Store,
    StoreLocation
} from "../models";
import {IManagementPartnerStore, ManagementStore, ManagerAppState} from "./models";
import {http, timeout} from "../effects";
import {Crashed, Errored} from "../actions";
import {State, User} from "../state";
import {reqAddEmployee, reqGetStore, reqMonitor, reqUpdateStore} from "../requests";

export const INIT = (state: State<Manager>): ManagerAppState => {
    return {
        ...state,
        activeTab: "monitor",
        updatingStore: undefined,
        store: state.currentUser.location,
        staffMembers: [],
        newMember: undefined,
        newPartnerStoreId: undefined,
    };
}

export const MonitoringLoaded = (state: ManagerAppState, {customersInStore, timestamp}: IServerMonitorResponse) => {
    return [{...state, numberOfVisitors: customersInStore, lastUpdatedVisitors: new Date(timestamp)} as ManagerAppState, timeout({
        seconds: 5,
        action: RefreshMonitoringData
    })];
}

export const LoadMonitoringTab = (state: ManagerAppState) => {
    return [{...state, activeTab: "monitor"} as ManagerAppState, reqMonitor(MonitoringLoaded, Crashed, state.store.id, false)]
};

export const RefreshMonitoringData = (state: ManagerAppState) => {
    if (state.activeTab !== "monitor") {
        return state;
    }
    return [state, reqMonitor(MonitoringLoaded, Crashed, state.store.id, true)];

}
const GET_STAFF_LIST = "staff/list";
export const LoadStaffTab = (state: ManagerAppState) => {
    // TODO: Wait backend?
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

export const SubmitNewMember = (state: ManagerAppState) => {
    const serverMember: IServerEmployeeRequest = {
        storeId: state.store.id,
        role: state.newMember.userType,
        email: state.newMember.email,
    }
    return [state, reqAddEmployee(LoadStaffTab, Errored, serverMember)];
}
const CHANGE_STAFF_TYPE = "staff/toggle";
export const ChangeStaffType = (state: ManagerAppState) => {
    return [state, http({
        path: CHANGE_STAFF_TYPE,
        method: "POST",
        resultAction: (state: ManagerAppState, _) => LoadStaffTab(state) as any,
        errorAction: Errored, // TODO: Wait for backend
    })]
}

const DELETE_STAFF = "staff/delete";
export const DeleteStaff = (state: ManagerAppState) => {
    // Prevent delete thyself // TODO: Deleting will not be implemented
    return [state, http({
        path: DELETE_STAFF,
        method: "POST",
        resultAction: (state: ManagerAppState, _) => LoadStaffTab(state) as any,
        errorAction: Errored,
    })]
};

export const LoadUpdateStoreTab = (state: ManagerAppState): ManagerAppState => {
    return {...state, updatingStore: {...state.store}, activeTab: "update"};
}

export const SaveStore = (state: ManagerAppState) => {
    const serverStore: IServerStoreRequest = {
        ...state.store,
        latitude: state.store.location.lat,
        longitude: state.store.location.lon,
        maxCustomers: state.store.maxCustomerCapacity,
        partnerStoreIds: state.store.partners.map((partner) => partner.id),
        timeOut: state.store.timeoutMinutes * 60 * 1000,

    }
    return [state, reqUpdateStore(StoreUpdated, Errored, state.store.id, serverStore)]
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
export const UpdateStoreDescription = (state: ManagerAppState, newDescription): ManagerAppState => {
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            description: newDescription,
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

export const UpdateStoreTimeout = (state: ManagerAppState, content: string): ManagerAppState => {
    const newValue = Number.parseInt(content);
    if (!Number.isNaN(newValue)) {
        state.updatingStore.timeoutMinutes = newValue;
    }
    return state;
}

export const UpdatePartnerStoreId = (state: ManagerAppState, content: string): ManagerAppState => {
    const newVal = Number.parseInt(content);
    if (!Number.isNaN(newVal)) {
        return {...state, newPartnerStoreId: newVal};
    }
    return state;
}
export const FindPartnerStore = (state: ManagerAppState) => {
    return [state, reqGetStore(PartnerStoreRetrieved, Errored, state.newPartnerStoreId)];
}

export const PartnerStoreRetrieved = (state: ManagerAppState, partnerStore: IManagementPartnerStore): ManagerAppState => {
    return {...state, foundPartnerStore: partnerStore};
}

export const AddNewPartnerStore = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        foundPartnerStore: undefined,
        newPartnerStoreId: undefined,
        updatingStore: {...state.updatingStore, partners: [...state.updatingStore.partners, state.foundPartnerStore]}
    }
};

export const CancelPartnerStoreAddition = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        foundPartnerStore: undefined,

    };
};

export const RemovePartnerStore = (partnerStore: IManagementPartnerStore) => (state: ManagerAppState): ManagerAppState => {
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
