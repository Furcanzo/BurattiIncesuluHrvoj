import {app} from "hyperapp";
import {INIT, RemoveErrors} from "./actions";
import {view} from "./view";
import {subscriptions} from "./effects";
import withRouter from '@mrbarrysoftware/hyperapp-router';
import {routes} from "./models";
let rendered = false;
withRouter(app)({
    router: {
        routes,
    },
    init: INIT,
    view: (state) => {
        rendered = true;
        console.log("Rendering state", JSON.parse(JSON.stringify(state)));
        return view(state);
    },
    node: document.getElementById("app"),
    subscriptions: subscriptions,
    middleware: (dispatch) => {
        return (...args) => {
            if (rendered) {
                rendered = false;
                dispatch([RemoveErrors, ...args]);
            }
            console.log("Dispatching with", JSON.parse(JSON.stringify(args)));
            dispatch(...args);
        }

    }
});
