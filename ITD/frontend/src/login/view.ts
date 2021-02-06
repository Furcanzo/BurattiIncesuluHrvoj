import {button, card, centered, formField, hiddenText, row, text, titleText, url} from "../widgets";
import {LoginAppState, ROUTE_REGISTER} from "./models";
import {LoadRegisterPage, SubmitLogin, SubmitRegister, UpdateLoginEmail, UpdateRegisterField} from "./actions";
import {SwitchTab} from "../actions";

const loginWidget = (state: LoginAppState) => {
    return [
        titleText("Welcome to CLup System", "2"),
        hiddenText(state.currentTab),
        centered(card(titleText("To use the system, please login first", "5"), [
            row(formField(state.user.email, "E-mail", UpdateLoginEmail, "email")),
            row([
                button("Login", "primary", SubmitLogin),
                button("Register instead?", "primary", SwitchTab(ROUTE_REGISTER)),
            ].map(centered))
        ])),
    ];
}

const registerWidget = (state: LoginAppState) => {
    const newUser = state.user;
    return [
        titleText("Register ", "2"),
        hiddenText(state.currentTab),
        centered(card(titleText("Please fill the form below", "4"), [
            row([
                formField(newUser.email, "Your Email", UpdateRegisterField("email"), "text"),
                formField(newUser.repeatEmail, "Re-write your email", UpdateRegisterField("repeatEmail"), "text")
            ]),
            row([
                formField(newUser.name, "Your Name", UpdateRegisterField("name"), "text"),
                formField(newUser.surname, "Your Surname", UpdateRegisterField("surname"), "text"),
            ]),
            row(formField(newUser.tel, "Your Phone Number", UpdateRegisterField("tel"), "tel")),

            row([
                centered(text(
                    "By submitting this form, you are agreeing to our ",
                    url("#", "Privacy Policy"),
                    " and ",
                    url("#", "Terms of Use")
                ))
            ]),
            row([
                button("Register", "primary", SubmitRegister),
                button("Clear", "danger", LoadRegisterPage),
            ].map(centered)),
        ])),
    ]
}

export const view = (state: LoginAppState) => {
    if (state.currentTab === "register") {
        return registerWidget(state);
    } else {
        return loginWidget(state);
    }
}
