import {app} from "hyperapp";
import {INIT} from "./actions";
import {view} from "./view";
app({
    init: INIT,
    view: view,
    node: document.getElementById("app"),
});
