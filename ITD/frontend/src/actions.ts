import {
    AnonUser,
    isAnonState,
    isClerkState,
    isCustomerState,
    isManagerState,
} from "./models";
import {clerkComponent} from "./clerk/models";
import {managerComponent} from "./manager/models";
import {customerComponent} from "./customer/models";
import {LoginAppState, loginComponent} from "./login/models";
import {INIT as LoginINIT} from "./login/actions";
import { effects } from '@mrbarrysoftware/hyperapp-router';
import {Component, INavigatorItem, State, User} from "./state";
import {readUserEmail, writeUserEmail} from "./util";
import {http} from "./effects";
import {reqLogin} from "./requests";

export const Loading = <U extends User>(state: State<U>): State<U> => {
    return {...state, loading: true};
}

export const Loaded = <U extends User>(state: State<U>): State<U> => {
    return {...state, loading: false}
}

export const Errored = <U extends User>(state: State<U>, errorText: string): State<U> => {
    return {...state, error: {text: errorText, recoverable: true}};
}

export const Crashed = <U extends User>(state: State<U>, errorText: string): State<U> => {
    return {...state, error: {text: errorText, recoverable: false}};
}
const findDefaultNavigation = (component: Component<any, any>): INavigatorItem => {
    return component.navigation.filter(nav => nav.isDefault)[0];
}
export const SwitchTab = (route: string) => (state)  => {
    return [state, effects.Navigate(route)];
}
export const NewUser = <U extends User>(state: State<User>, newUser: U): any[] => {
    let newState: State<U> = {currentUser: newUser, ...state} as State<U>;
    let component: Component<any, any>;
    if (isClerkState(newState)) {
        component = clerkComponent;
    } else if (isManagerState(newState)) {
        component = managerComponent;
    } else if (isCustomerState(newState)) {
        component = customerComponent;
    } else if (isAnonState(newState)) {
        component = loginComponent;
    }
    newState = component.initAction(newState);
    return [newState, effects.Navigate(findDefaultNavigation(component).route)];
}
export const Nothing = <U extends User>(state: State<U>): State<U> => {
    return state;
}

const firstState = {
    loading: false,
    currentUser: {
        role: "anonymous",
        email: "",
    } as User,
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
    return firstState;
}

export const Logout = (state: State<User>) => {
    writeUserEmail("");
    return NewUser({...firstState}, {email: "", role: "anonymous"})
}
