import {app} from "hyperapp";
import {INIT, RemoveErrors} from "./actions";
import {view} from "./view";
import {subscriptions} from "./effects";
app({
    init: INIT,
    view: (state) => {
        console.log("Rendering state", JSON.parse(JSON.stringify(state)));
        return view(state);
    },
    node: document.getElementById("app"),
    subscriptions: subscriptions,
    middleware: (dispatch) => {
        return (...args) => {
            console.log("Dispatching with", args, JSON.parse(JSON.stringify(args)));
            dispatch(...args);
        }

    }
});
