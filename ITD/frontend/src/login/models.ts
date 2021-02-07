import {AnonUser} from "../models";
import {INIT, LoadLoginPage, LoadRegisterPage} from "./actions";
import {view} from "./view";
import {Component, INavigatorItem, State} from "../noImport";

export class LoginAppState extends State<AnonUser> {
    activeTab: "login" | "register";
    user: {
        email: string;
        repeatEmail?: string;
        name?: string;
        surname?: string;
        tel?: string;
    };
}
export const ROUTE_REGISTER = "/register";
export const ROUTE_LOGIN = "/login";
const navigationItems: INavigatorItem[] = [{
    isDefault: true,
    title: "Login",
    route: ROUTE_LOGIN,
    onEnter: LoadLoginPage,
}, {
    isDefault: false,
    title: "Register",
    route: ROUTE_REGISTER,
    onEnter: LoadRegisterPage,
}]

export const loginComponent = new Component(view, INIT, navigationItems);
