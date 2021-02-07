import {
    Clerk,
    IServerEmployeeRequest,
    IServerMonitorResponse, IServerStoreRequest, IServerStoreResponse,
    Manager,
} from "../models";
import {IManagementPartnerStore, ManagementStore, ManagerAppState} from "./models";
import {timeout} from "../effects";
import {Crashed, Errored} from "../actions";
import {State, StoreLocation, User} from "../noImport";
import {reqAddEmployee, reqChangeRole, reqGetStaffList, reqGetStore, reqMonitor, reqUpdateStore} from "../requests";
import {parseServerTimeSlot, resetMap, timeToMillis} from "../util";

export const INIT = (state: State<Manager>): ManagerAppState => {
    const oldStore: IServerStoreResponse = state.currentUser.store as any;
    const clientStore: ManagementStore = {
        partners: oldStore.partnerStores as any, // Ids always come from the server.
        timeoutMinutes: oldStore.timeOut / 60 / 1000,
        workingHours: parseServerTimeSlot({startTime: oldStore.workingHour.from, endTime: oldStore.workingHour.until}),
        ...oldStore,
        location: {
            lat: oldStore.latitude,
            lon: oldStore.longitude,
        },
        maxCustomerCapacity: oldStore.maxCustomers

    }
    return {
        ...state,
        currentUser: {
            ...state.currentUser,
            store: clientStore,
        },
        activeTab: "monitor",
        updatingStore: undefined,
        store: clientStore,
        staffMembers: [],
        newMember: undefined,
        newPartnerStoreId: undefined,
    };
}

export const MonitoringLoaded = (state: ManagerAppState, {customersInStore, timestamp}: IServerMonitorResponse) => {
    return [{
        ...state,
        numberOfVisitors: customersInStore,
        lastUpdatedVisitors: new Date(timestamp)
    } as ManagerAppState, timeout({
        seconds: 5,
        action: RefreshMonitoringData
    })];
}

export const LoadMonitoringTab = (state: ManagerAppState) => {
    return [{
        ...state,
        activeTab: "monitor"
    } as ManagerAppState, reqMonitor(MonitoringLoaded, Crashed, false)]
};

export const RefreshMonitoringData = (state: ManagerAppState) => {
    if (state.activeTab !== "monitor") {
        return state;
    }
    return [state, reqMonitor(MonitoringLoaded, Crashed, true)];

}
export const LoadStaffTab = (state: ManagerAppState) => {
    return [
        {...state, activeTab: "staff", newMember: new Manager(state.store, "")} as ManagerAppState,
        reqGetStaffList(StaffListLoaded, Crashed),
    ]
}
export const StaffListLoaded = (state: ManagerAppState, staffMembers: User[]): ManagerAppState => {
    return {...state, staffMembers};
}

export const UpdateNewMemberEmail = (state: ManagerAppState, content: string): ManagerAppState => {
    return {...state, newMember: {...state.newMember, email: content}};
}

export const SetNewMemberAs = (as: "manager" | "clerk") => (state: ManagerAppState) => {
    return {...state, newMember: {...state.newMember, role: as}};
}

export const SubmitNewMember = (state: ManagerAppState) => {
    const serverMember: IServerEmployeeRequest = {
        storeId: state.store.id,
        role: state.newMember.role,
        email: state.newMember.email,
    }
    return [state, reqAddEmployee(LoadStaffTab, Errored, serverMember)];
}

export const ChangeStaffType = (member: User) => (state: ManagerAppState) => {
    debugger;
    const newRole = member.role === "clerk" ? "manager" : "clerk";
    return [state, reqChangeRole(LoadStaffTab, Errored, member.id, newRole)];
}

export const LoadUpdateStoreTab = (state: ManagerAppState): ManagerAppState => {
    resetMap();
    return {...state, updatingStore: {...state.store}, activeTab: "update", newPartnerStoreId: 0};
}

export const SaveStore = ({updatingStore, ...rest}: ManagerAppState) => {
    const serverStore: IServerStoreRequest = {
        ...updatingStore,
        latitude: updatingStore.location.lat,
        longitude: updatingStore.location.lon,
        maxCustomers: updatingStore.maxCustomerCapacity,
        partnerStoreIds: updatingStore.partners.map((partner) => partner.id),
        timeOut: updatingStore.timeoutMinutes * 60 * 1000,
        workingHourDTO: {
            id: rest.store.workingHours.id,
            from: timeToMillis(updatingStore.workingHours.start),
            until: timeToMillis(updatingStore.workingHours.end),
        }

    }
    return [{...rest, updatingStore}, reqUpdateStore(StoreUpdated, Errored, updatingStore.id, serverStore)]
};

export const StoreUpdated = (state: ManagerAppState) => {
    return LoadUpdateStoreTab({
        ...state,
        store: state.updatingStore,
        currentUser: {...state.currentUser, store: state.updatingStore}
    });
};

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
    resetMap();
    return {...state, foundPartnerStore: partnerStore};
}

export const AddNewPartnerStore = (state: ManagerAppState): ManagerAppState => {
    return {
        ...state,
        foundPartnerStore: undefined,
        newPartnerStoreId: 0,
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
    debugger;
    return {
        ...state,
        updatingStore: {
            ...state.updatingStore,
            partners: state.updatingStore.partners.filter(store => store.id !== partnerStore.id),
        }
    }
}
