import {AnonUser, State} from "../models";
import {LoginAppState} from "./models";
import {http} from "../effects";
import {Errored, NewUser} from "../actions";

export const INIT = (state: State<AnonUser>): LoginAppState => {
    return {...state, user: {email: ""}};
}

export const LoadLoginPage = (state: LoginAppState) => {
    state.user = {email: ""};
    return state;
}

export const UpdateLoginEmail = (state: LoginAppState, content: string): LoginAppState => {
    state.user.email = content;
    return state;
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
        const newVal = Errored(state, "Please provide an email");
        debugger;
        return newVal;
    }
}

export const LoadRegisterPage = (state: LoginAppState) => {
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
            errorAction: Errored,
            resultAction: NewUser as any,
        })]
    };
    return Errored(state, "Please provide all the values on the form below");
}
