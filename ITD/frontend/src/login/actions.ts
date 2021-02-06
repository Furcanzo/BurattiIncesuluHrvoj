import {AnonUser, Customer, IServerCustomerRequest, IServerCustomerResponse} from "../models";
import {LoginAppState} from "./models";
import {Errored, NewUser} from "../actions";
import {State} from "../noImport";
import {reqLogin, reqRegister} from "../requests";

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
        return [state, reqLogin(NewUser, Errored, state.user.email)];
    }
    return Errored(state, "Please provide an email");
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
        const requestUser: IServerCustomerRequest = {
            name: newUser.name,
            phoneNumber: newUser.tel,
            surname: newUser.surname,
            email: newUser.email
        };
        const success = (state, response: IServerCustomerResponse) => {
            const user = new Customer();
            user.name = response.name;
            user.surname = response.surname;
            user.tel = response.phoneNumber;
            user.email = response.email;
            return NewUser(state, user);
        }
        return [state, reqRegister(success, Errored, requestUser)];
    }
    return Errored(state, "Please provide all the values on the form below");
}
