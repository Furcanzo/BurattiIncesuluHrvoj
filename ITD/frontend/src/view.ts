import {INavigatorItem, isAnonState, isClerkState, isCustomerState, isManagerState, State, User} from "./models";
import {clerkComponent} from "./clerk/models";
import {customerComponent} from "./customer/models";
import {managerComponent} from "./manager/models";
import {loginComponent} from "./login/models";
import {navbar, text, wrapper} from "./widgets";
import {Navigate, Nothing} from "./actions";

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
        innerContent = text("Loading"); // TODO: Better looking
    }
    return wrapper(navigation(navItems, state), innerContent);
}

const navigation = (navigationItems: INavigatorItem[], state: State<User>) => {
    return navbar(navigationItems.map(item => {
        return {active: item.title === state.currentRoute, title: item.title, onClick: Navigate(state, item)};
    }), Nothing)
}
