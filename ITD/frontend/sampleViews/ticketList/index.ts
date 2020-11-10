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
    clickable,
    text,
    smallColumn, fillWidth
} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {clerkNavigation, customerNavigation, dates, lineNumberRequest, lineNumbers} from "../sampleData";
import {dateStr, timeStr} from "../../src/view";

const layout = (state = undefined) => {
    const menu = navbar(customerNavigation, Nothing);
    return wrapper(menu, [
        fillWidth(card(titleText("My Tickets"), lineNumbers.map((lineNumber) => {
            return smallColumn(clickable(card(titleText(lineNumber.location.name), [
                titleText(lineNumber.number.toString(), "4"),
                titleText(dateStr(lineNumber.time.day), "5"),
                titleText(`${timeStr(lineNumber.time.start)}-${timeStr(lineNumber.time.end)}`, "5"),
                text("Click for line number & details")
            ])))
        }), "dark", Nothing, true)),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
