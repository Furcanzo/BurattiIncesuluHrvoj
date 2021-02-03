import {AnonUser, Component, INavigatorItem, State} from "../models";
import {INIT, LoadLoginPage, LoadRegisterPage} from "./actions";
import {row, text} from "../widgets";
import {view} from "./view";

export class LoginAppState extends State<AnonUser> {
    user: {
        email: string;
        repeatEmail?: string;
        name?: string;
        surname?: string;
        tel?: string;
    };
}

const navigationItems: INavigatorItem[] = [{
    isDefault: true,
    title: "Login",
    route: LoadLoginPage,
}, {
    isDefault: false,
    title: "Register",
    route: LoadRegisterPage
}]

export const loginComponent = new Component(view, INIT, navigationItems);
