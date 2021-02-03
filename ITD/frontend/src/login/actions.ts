import {AnonUser} from "../models";
import {LoginAppState} from "./models";
import {http} from "../effects";
import {Errored, NewUser} from "../actions";
import {State} from "../state";

export const INIT = (state: State<AnonUser>): LoginAppState => {
    return {...state, user: {email: ""}, currentTab: "login"};
}

export const LoadLoginPage = (state: LoginAppState): LoginAppState => {
    state.currentTab = "login";
    state.user = {email: ""};
    return {...state, currentTab: "login", user: {email: ""}};
}

export const UpdateLoginEmail = (state: LoginAppState, content: string): LoginAppState => {
    return {...state, user: {...state.user, email: content}};
}

export const SubmitLogin = (state: LoginAppState) => {
    if (state.user.email) {
        return [state, http({
            path: "login",
            method: "POST",
            body: state.user,
            errorAction: Errored,
            resultAction: NewUser as any
        })];
    } else {
        return Errored(state, "Please provide an email");
    }
}

export const LoadRegisterPage = (state: LoginAppState): LoginAppState => {
    return {...state, currentTab: "register", user: {email: "", repeatEmail: "", name: "", surname: "", tel: ""}};
}
export const UpdateRegisterField = (field: "email" | "repeatEmail" | "tel" | "name" | "surname") =>
    (state: LoginAppState, content: string): LoginAppState => {
        const newState = {...state};
        newState.user[field] = content;
        return newState;
    };

export const SubmitRegister = (state: LoginAppState) => {
    const newUser = state.user;
    if (newUser.repeatEmail === newUser.email && newUser.email && newUser.name && newUser.surname && newUser.tel) {
        return [state, http({
            path: "register",
            method: "POST",
            body: newUser,
            errorAction: Errored,
            resultAction: NewUser as any,
        })]
    }
    return Errored(state, "Please provide all the values on the form below");
}
