import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {titleText, navbar, row, wrapper, button, qrCodeReader, card, formField, centered} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {bakery, managerNavigation} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar(managerNavigation, Nothing);
    return wrapper(menu, [
        centered(card(titleText("Edit Location", "2"), [
            row(formField(bakery.name, "Name", Nothing, "text")),
            row(formField(bakery.timeout.toString(), "Customer Ticket Timeout", Nothing, "number")),

            row([
                button("Save", "success", Nothing),
                button("Discard Changes", "error", Nothing),
            ].map(centered))
        ])),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
