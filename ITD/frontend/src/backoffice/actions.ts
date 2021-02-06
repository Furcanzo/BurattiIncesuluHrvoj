import {AnonUser} from "../models";
import {CreateStoreAppState, NewStore} from "./models";
import {http} from "../effects";
import {Errored} from "../actions";
import {State} from "../state";

const emptyNewStore: NewStore = {name: "", managerEmail: ""}
export const INIT = (state: State<AnonUser>): CreateStoreAppState => {
    return {...state, newStore: emptyNewStore};
}

export const CreateStorePage = (state: CreateStoreAppState) => {
    return {...state, newStore: emptyNewStore};
}


export const UpdateStoreField = (field: "managerEmail" | "name") =>
    (state: CreateStoreAppState, content: string): CreateStoreAppState => {
        state.newStore[field] = content;
        return state;
    };

const StoreAdded = (state: CreateStoreAppState) => {
    return state;
}

const CREATE_STORE = "addStore";

export const SubmitStore = (state: CreateStoreAppState) => {
    const newStore = state.newStore
    if (newStore.managerEmail && newStore.name) {
        return [state, http({
            path: CREATE_STORE,
            method: "POST",
            body: newStore,
            errorAction: Errored,
            resultAction: StoreAdded,
        })]
    }
    return Errored(state, "Please fill all the required fields");
}
