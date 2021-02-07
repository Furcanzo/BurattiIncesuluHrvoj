import {
    isAnonState, isBackOfficeState,
    isClerkState,
    isCustomerState,
    isManagerState, routes,
} from "./models";
import {clerkComponent} from "./clerk/models";
import {managerComponent} from "./manager/models";
import {customerComponent} from "./customer/models";
import {loginComponent} from "./login/models";
import { effects } from '@mrbarrysoftware/hyperapp-router';
import {Component, INavigatorItem, State, User} from "./noImport";
import {readUserEmail, resetMap, writeUserEmail} from "./util";
import {reqLogin} from "./requests";
import {createStoreComponent} from "./backoffice/models";

export const Loading = <U extends User>(state: State<U>): State<U> => {
    return {...state, loading: true};
}

export const Loaded = <U extends User>(state: State<U>): State<U> => {
    return {...state, loading: false}
}

export const Errored = <U extends User>(state: State<U>, errorText: string): State<U> => {
    resetMap();
    return {...state, error: {text: errorText, recoverable: true}};
}

export const Crashed = <U extends User>(state: State<U>, errorText: string): State<U> => {
    return {...state, error: {text: errorText, recoverable: false}};
}
const findDefaultNavigation = (component: Component<any, any>): INavigatorItem => {
    return component.navigation.filter(nav => nav.isDefault)[0];
}
export const SwitchTab = (route: string) => (state)  => {
    const initialized = routes[route].load(state);
    resetMap();
    return [...(Array.isArray(initialized) ? initialized : [initialized]), effects.Navigate(route)];
}
export const NewUser = <U extends User>(state: State<User>, newUser: U): any[] => {
    let newState: State<U> = {...state, currentUser: newUser, initialized: true} as State<U>; /// Old state is on the front?
    let component: Component<any, any>;
    resetMap();
    if (isClerkState(newState)) {
        component = clerkComponent;
    } else if (isManagerState(newState)) {
        component = managerComponent;
    } else if (isCustomerState(newState)) {
        component = customerComponent;
    } else if (isAnonState(newState)) {
        component = loginComponent;
    } else if (isBackOfficeState(newState)) {
        component = createStoreComponent;
    } else {
        return [newState, Nothing]; // This happens when we error on user authentication, the loaded action will dispatch the correct error
    }
    if (newState.error && !newState.error.recoverable) {
        return [newState, Nothing]; // We crashed, everything can happen
    }
    newState = component.initAction(newState);
    const nav = findDefaultNavigation(component);
    const initialized = nav.onEnter(newState);
    return [...(Array.isArray(initialized) ? initialized : [initialized]), effects.Navigate(nav.route)];
}
export const Nothing = <U extends User>(state: State<U>): State<U> => {
    return state;
}

const firstState = {
    loading: true,
    currentUser: {
        role: "anonymous",
        email: "",
    } as User,
    initialized: false,
    error: undefined,
};

export const RemoveErrors = (state: State<User>): State<User> => {
    if (state.error?.recoverable) {
        return {...state, error: undefined};
    }
    return state;
}

export const INIT = () => {
    const state = {...firstState};
    state.currentUser.email = readUserEmail();
    if (state.currentUser.email) {
        return [state, reqLogin(NewUser, Crashed, state.currentUser.email)];
    }
    return NewUser({...firstState, initialized: true, loading: false}, state.currentUser);
}

export const Logout = (state: State<User>) => {
    writeUserEmail("");
    return INIT();
}
