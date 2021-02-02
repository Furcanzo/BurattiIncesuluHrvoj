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
const findDefaultNavigation = (component: Component<any, any>): INavigatorItem => {
    return component.navigation.filter(nav => nav.isDefault)[0];
}

export const NewUser = <U extends User>(state: State<User>, newUser: U): State<U> => {
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
    currentRoute: findDefaultNavigation(loginComponent).title,
});

export const INIT = () => {
    return firstState;
}
