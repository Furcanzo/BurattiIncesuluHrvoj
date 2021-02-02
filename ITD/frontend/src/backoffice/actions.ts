import {AnonUser, State} from "../models";
import {CreateStoreAppState, NewStore} from "./models";
import {http} from "../effects";

const emptyNewStore: NewStore = {name: "", managerEmail: ""}
export const INIT = (state: State<AnonUser>): CreateStoreAppState => {
    return {...state, error: null, newStore: emptyNewStore};
}

export const CreateStorePage = (state: CreateStoreAppState) => {
    state.error = null;
    state.newStore = emptyNewStore;
    return state;
}

const Error = (text: string) => (state: CreateStoreAppState): CreateStoreAppState => {
    return {...state, error: text};
}

export const UpdateStoreField = (field: "managerEmail" | "name") =>
    (state: CreateStoreAppState, content: string): CreateStoreAppState => {
        state.error = null;
        state.newStore[field] = content;
        return state;
    };

const StoreAdded = (state: CreateStoreAppState) => {
    return state;
}
export const SubmitStore = (state: CreateStoreAppState) => {
    const newStore = state.newStore
    if (newStore.managerEmail && newStore.name) {
        return [state, http({
            path: "addStore",
            method: "POST",
            body: newStore,
            errorAction: Error("Submit Failed"),
            resultAction: StoreAdded,
        })]
    }
}
