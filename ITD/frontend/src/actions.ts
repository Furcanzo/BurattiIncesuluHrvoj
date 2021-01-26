import {State} from "./models";


export const Loading = (state: State): State => {
    return {...state, loading: true};
}

export const Loaded = (state: State): State => {
    return {...state, loading: false}
}
