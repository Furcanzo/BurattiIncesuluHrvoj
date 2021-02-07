import {isAnonState, isBackOfficeState, isClerkState, isCustomerState, isManagerState} from "./models";
import {clerkComponent} from "./clerk/models";
import {customerComponent} from "./customer/models";
import {managerComponent} from "./manager/models";
import {loginComponent} from "./login/models";
import {crashedWidget, loadingWidget, navbar, text, wrapper} from "./widgets";
import {Logout, NewUser, Nothing, SwitchTab} from "./actions";
import {INavigatorItem, State, User} from "./noImport";
import {getCurrentPath} from "./util";
import {createStoreComponent} from "./backoffice/models";

export const view = (state: State<User>) => {
    let innerContent;
    let navItems: INavigatorItem[];
    if (!state.initialized) {
        innerContent = [];
        navItems = [];
    } else if (isClerkState(state)) {
        innerContent = clerkComponent.view(state);
        navItems = clerkComponent.navigation;
    } else if (isCustomerState(state)) {
        innerContent = customerComponent.view(state);
        navItems = customerComponent.navigation;
    } else if (isManagerState(state)) {
        innerContent = managerComponent.view(state);
        navItems = managerComponent.navigation;
    } else if (isAnonState(state)) {
        innerContent = loginComponent.view(state);
        navItems = loginComponent.navigation;
    } else if (isBackOfficeState(state)) {
        innerContent = createStoreComponent.view(state);
        navItems = createStoreComponent.navigation;
    }
    if (state.loading) {
        innerContent = loadingWidget();
    }
    if (state.error && !state.error.recoverable) {
        innerContent = crashedWidget();
    }
    return wrapper(navigation(navItems, state), innerContent, state.error?.recoverable ? state.error.text : undefined);
}

const logout: INavigatorItem = {
    title: "Logout",
    route: "/logout",
    onEnter: Logout,
    isDefault: false
};
const navigation = (navigationItems: INavigatorItem[], state: State<User>) => {
    if (state.currentUser.role !== "anonymous") {

        navigationItems = [...navigationItems, logout];
    }
    return navbar(navigationItems.map(item => {
        return {
            active: item.route === getCurrentPath(), title: item.title, onClick:
                item.title !== logout.title ? SwitchTab(item.route) : Logout
        };
    }), Nothing)
}
