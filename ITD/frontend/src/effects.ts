import {API_URL, MAPS_LOCATION_SELECTED_EVENT_NAME} from "./const";
import {Loaded, Loading} from "./actions";
import {isManagerState} from "./models";
import {UpdateLocation} from "./manager/actions";
import {State, StoreLocation} from "./noImport";
import {readUserEmail, writeUserEmail} from "./util";

export interface IHTTPOptions<State, Request, Response> {
    path: string;
    body?: Request;
    resultAction: (state: State, data: Response) => State;
    errorAction: (state: State, text?: string) => any;
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
    showScreenWhileLoading?: boolean;
}
const getErrorMessage = (e: Error) => {
    if (e.message.includes("NetworkError")) {
        return "Please check that you are connected to the internet";
    }
    return e.message;
}
export const http = <State, Request, Response>(props: IHTTPOptions<State, Request, Response>) => [
    async <State, Request, Response>(dispatch, props: IHTTPOptions<State, Request, Response>) => {
        const url = API_URL + props.path;
        const requestProps:RequestInit = {
            body: props.body ? JSON.stringify(props.body) : null,
            method: props.method,
            headers: new Headers([
                ["Bearer", readUserEmail()],
                ...(props.body ? [["Content-Type", "application/json; charset=utf-8"]] : [])
            ])
        };
        if (!props.showScreenWhileLoading) {
            dispatch(Loading);
        }
        /*Do we want to remove the previous request if a new one is issued whole screen will be loading so we won't have that case*/
        fetch(url, requestProps).then((rawResponse) => {
            const rawResponse2 = rawResponse.clone();
            rawResponse.json().then(response => {
                if (response.hasOwnProperty("email")) {
                    writeUserEmail(response.email);
                }
                dispatch([props.resultAction, response]);
            }) .catch((err) => {
                console.error(err);
                rawResponse2.text().then((text) => {
                    dispatch([props.errorAction, text]);
                }).catch((e) => {
                    console.log(e);
                    dispatch([props.errorAction, getErrorMessage(e)]);
                });
            })
        }).catch((e) => {
            console.log(e);
            dispatch([props.errorAction, getErrorMessage(e)]);
        }).finally(() => {
            dispatch(Loaded);
        })
    }, props];

export interface ITimeoutOptions<State> {
    seconds: number;
    action: (State) => any;
}
export const timeout = <State>(props: ITimeoutOptions<State>) => [
    (dispatch, props: ITimeoutOptions<State>) => {
        setTimeout(() => dispatch(props.action), props.seconds * 1000);
    }, props]

// Subscription to update locations selected on the map.

const subMapLocationSelected = [(dispatch) => {
    const handler = (ev: CustomEvent<StoreLocation>) => {
        dispatch([UpdateLocation, ev.detail]);
    }
    window.addEventListener(MAPS_LOCATION_SELECTED_EVENT_NAME, handler);

    return () => window.removeEventListener(MAPS_LOCATION_SELECTED_EVENT_NAME, handler);
}];
export const subscriptions = (state: State<any>) => {
    if (isManagerState(state) && state.activeTab === "update") {
        return [subMapLocationSelected];
    }
    return [];
}

