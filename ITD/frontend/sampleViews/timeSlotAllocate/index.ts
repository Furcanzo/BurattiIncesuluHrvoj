import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {titleText, navbar, row, wrapper, button, column} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {dateTimeSlotSelection, estimatedStaySelector, productSelector} from "../../src/view";
import {customerNavigation, dates, lineNumberRequest} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar(customerNavigation, Nothing);
    return wrapper(menu, [
        titleText(`Booking for ${lineNumberRequest.location.name}`, "3"),
        titleText("Select time for your visit:", "4"),
        dateTimeSlotSelection(lineNumberRequest, dates, dates[0]),
        estimatedStaySelector(lineNumberRequest.estimatedTimeOfVisit),
        productSelector(lineNumberRequest.location.products, lineNumberRequest.products),
        button("Book", "primary", Nothing, "lg", true),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
