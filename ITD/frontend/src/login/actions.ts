import {AnonUser, State} from "../models";
import {LoginAppState} from "./models";
import {http} from "../effects";
import {NewUser} from "../actions";

export const INIT = (state: State<AnonUser>): LoginAppState => {
    return {...state, error: null, user: {email: ""}};
}

export const LoadLoginPage = (state: LoginAppState) => {
    state.error = null;
    state.user = {email: ""};
    return state;
}

export const UpdateLoginEmail = (state: LoginAppState, content: string): LoginAppState => {
    state.error = null;
    state.user.email = content;
    return state;
}

const Error = (text: string) => (state: LoginAppState): LoginAppState => {
    return {...state, error: text};
}
export const SubmitLogin = (state: LoginAppState) => {
    if (state.user.email) {
        return [state, http({
            path: "login",
            method: "POST",
            body: state.user,
            errorAction: Error("Login Failed"),
            resultAction: NewUser as any
        })];
    } else {
        return {...state, error: "Please provide an email"}
    }
}

export const LoadRegisterPage = (state: LoginAppState) => {
    state.error = null;
    state.user = {email: "", repeatEmail: "", name: "", surname: "", tel: ""};
    return state;
}
export const UpdateRegisterField = (field: "email" | "repeatEmail" | "tel" | "name" | "surname") =>
    (state: LoginAppState, content: string): LoginAppState => {
        state.error = null;
        state.user[field] = content;
        return state;
    };

export const SubmitRegister = (state: LoginAppState) => {
    const newUser = state.user;
    if (newUser.repeatEmail === newUser.email && newUser.email && newUser.name && newUser.surname && newUser.tel) {
        return [state, http({
            path: "register",
            method: "POST",
            body: newUser,
            errorAction: Error("Submit Failed"),
            resultAction: NewUser as any,
        })]
    }
}
