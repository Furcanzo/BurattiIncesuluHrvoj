import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {
    titleText,
    navbar,
    row,
    wrapper,
    button,
    qrCodeGenerator,
    card,
    centered
} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {clerkNavigation, dates, lineNumberRequest, lineNumbers} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar(clerkNavigation, Nothing);
    const lineNumber = lineNumbers[0];
    return wrapper(menu, [
        titleText("Generated ticket:", "3"),
        centered(card(titleText(lineNumber.number.toString(), "2"), [
            row(qrCodeGenerator(lineNumber.id)),

        ])),
        centered(button("Print Ticket", "primary", Nothing)),
        centered(button("Create New Ticket", "primary", Nothing))
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
