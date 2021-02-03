import {
    AnonUser, Component,
    INavigatorItem,
    isAnonState,
    isClerkState,
    isCustomerState,
    isManagerState,
    State,
    User
} from "./models";
import {ClerkAppState, clerkComponent} from "./clerk/models";
import {managerComponent} from "./manager/models";
import {customerComponent} from "./customer/models";
import {LoginAppState, loginComponent} from "./login/models";
import {INIT as LoginINIT} from "./login/actions";


export const Loading = <U extends User> (state: State<U>): State<U> => {
    return {...state, loading: true};
}

export const Loaded = <U extends User> (state: State<U>): State<U> => {
    return {...state, loading: false}
}

export const Errored = <U extends User> (state: State<U>, errorText:string): State<U> => {
    return {...state,  error: {text: errorText, recoverable: true}};
}

export const Crashed = <U extends User> (state: State<U>, errorText:string): State<U> => {
    return {...state,  error: {text: errorText, recoverable: false}};
}
const findDefaultNavigation = (component: Component<any, any>): INavigatorItem => {
    debugger;
    return component.navigation.filter(nav => nav.isDefault)[0];
}

export const NewUser = <U extends User>(state: State<User>, newUser: U): State<U> => {
    debugger;
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
    return Navigate(newState, findDefaultNavigation(component))
}

export const Nothing = <U extends User> (state: State<U>): State<U> => {
    return state;
}

export const Navigate = (state: State<User>, navItem: INavigatorItem) => {
    state.currentRoute = navItem.title;
    return navItem.route(state);
}

const firstState: LoginAppState = LoginINIT({
    loading: false,
    currentUser: {
        userType: "anonymous",
        email: "",
    },
    error: undefined,
    currentRoute: findDefaultNavigation(loginComponent).title,
});

export const RemoveErrors = (state: State<User>): State<User> => {
    if (state.error.recoverable) {
        state.error = undefined;
    }
    return state;
}
export const INIT = () => {
    return firstState;
}
