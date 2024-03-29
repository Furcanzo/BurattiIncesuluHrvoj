import {AnonUser} from "../models";
import {CreateStoreAppState, NewStore} from "./models";
import {Errored} from "../actions";
import {State} from "../noImport";
import {reqCreateStore} from "../requests";

const emptyNewStore: NewStore = {name: "", firstManagerEmail: ""}
export const INIT = (state: State<AnonUser>): CreateStoreAppState => {
    return {...state, newStore: {...emptyNewStore}};
}

export const CreateStorePage = (state: CreateStoreAppState) => {
    return {...state, newStore: {...emptyNewStore}};
}


export const UpdateStoreField = (field: "firstManagerEmail" | "name") =>
    (state: CreateStoreAppState, content: string): CreateStoreAppState => {
        state.newStore[field] = content;
        return state;
    };

const StoreAdded = (state: CreateStoreAppState): CreateStoreAppState => {
    return {...state, lastCreatedStore: state.newStore, newStore: {...emptyNewStore}};
}

export const SubmitStore = (state: CreateStoreAppState) => {
    const newStore = state.newStore;
    if (newStore.firstManagerEmail && newStore.name) {
        return [state, reqCreateStore(StoreAdded, Errored, newStore)];
    }
    return Errored(state, "Please fill all the required fields");
}
