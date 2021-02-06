import {isAnonState, isClerkState, isCustomerState, isManagerState} from "./models";
import {clerkComponent} from "./clerk/models";
import {customerComponent} from "./customer/models";
import {managerComponent} from "./manager/models";
import {loginComponent} from "./login/models";
import {navbar, text, wrapper} from "./widgets";
import {Logout, Nothing, SwitchTab} from "./actions";
import {INavigatorItem, State, User} from "./noImport";
import {getCurrentPath} from "./util";

export const view = (state: State<User>) => {
    let innerContent;
    let navItems: INavigatorItem[];
    if (isClerkState(state)) {
        innerContent = clerkComponent.view(state);
        navItems = clerkComponent.navigation;
    }
    if (isCustomerState(state)) {
        innerContent = customerComponent.view(state);
        navItems = customerComponent.navigation;
    }
    if (isManagerState(state)) {
        innerContent = managerComponent.view(state);
        navItems = clerkComponent.navigation;
    }
    if (isAnonState(state)) {
        innerContent = loginComponent.view(state);
        navItems = loginComponent.navigation;
    }
    if (state.loading) {
        innerContent = [text("Loading")]; // TODO: Better looking
    }
    if (state.error && !state.error.recoverable) {
        innerContent = [text("Crashed, please refresh")];
    }
    return wrapper(navigation(navItems, state), innerContent, state.error?.recoverable ? state.error.text : undefined);
}

const navigation = (navigationItems: INavigatorItem[], state: State<User>) => {
    if (state.currentUser.role !== "anonymous") {
        const logout: INavigatorItem = {
            title: "Logout",
            route: "/logout",
            onEnter: Logout,
            isDefault: false
        };
        navigationItems = [...navigationItems, logout];
    }
    return navbar(navigationItems.map(item => {
        return {active: item.route === getCurrentPath(), title: item.title, onClick: SwitchTab(item.route)};
    }), Nothing)
}
