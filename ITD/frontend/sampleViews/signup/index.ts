import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {
    titleText,
    navbar,
    row,
    wrapper,
    button,
    qrCodeReader,
    card,
    formField,
    centered,
    text, url
} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {newUser} from "../sampleData";

const layout = (state = undefined) => {

    const menu = navbar([], Nothing);
    return wrapper(menu, [
        titleText("Register ", "2"),
        centered(card(titleText("Please provide your details below", "4"), [
            row([
                formField(newUser.name, "Your Name", Nothing, "text"),
                formField(newUser.surname, "Your Surname", Nothing, "text"),
            ]),
            row(formField(newUser.tel, "Your Phone Number", Nothing, "tel")),

            row([
                centered(text(
                    "By submitting this form, you are agreeing to our ",
                    url("#", "Privacy Policy"),
                    " and ",
                    url("#", "Terms of Use")
                ))
            ]),
            row([
                button("Register", "primary", Nothing),
            ].map(centered)),
        ])),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
