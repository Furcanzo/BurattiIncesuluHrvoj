import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {titleText, navbar, row, wrapper, button, qrCodeReader, card, formField, centered} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {loginUser} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar([], Nothing);
    return wrapper(menu, [
        titleText("Welcome to CLup System", "2"),
        centered(card(titleText("To use the system, please login first", "5"), [
            row(formField(loginUser.email, "E-mail", Nothing, "email")),
            row(formField(loginUser.password, "Password", Nothing, "password")),
            row([
                button("Login", "primary", Nothing),
                button("Register", "primary", Nothing),
            ].map(centered))
        ])),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
