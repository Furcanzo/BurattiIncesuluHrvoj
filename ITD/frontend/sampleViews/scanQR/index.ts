import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {titleText, navbar, row, wrapper, button, qrCodeReader} from "../../src/widgets";
import {Nothing} from "../../src/actions";
import {clerkNavigation, dates, lineNumberRequest} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar(clerkNavigation, Nothing);
    return wrapper(menu, [
        titleText("Scan QR Code", "3"),
        qrCodeReader(Nothing),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
