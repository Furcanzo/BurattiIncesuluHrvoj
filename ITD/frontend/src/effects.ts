import {API_URL, BASE_URL, MAPS_LOCATION_SELECTED_EVENT_NAME} from "./const";
import {Loaded, Loading} from "./actions";
import {isManagerState, State, StoreLocation} from "./models";
import {UpdateLocation} from "./manager/actions";

export interface IHTTPOptions<State, Request, Response> {
    path: string;
    body?: Request;
    resultAction: (state: State, data: Response) => State;
    errorAction: (state: State, text?: string) => any;
    method: "GET" | "POST" | "DELETE" | "PUT" ;// TODO: Add more if needed
    showScreenWhileLoading?: boolean;
}
export const http = <State, Request, Response>(props: IHTTPOptions<State, Request, Response>) => [
    async <State, Request, Response>(dispatch, props: IHTTPOptions<State, Request, Response>) => {
        const url = API_URL + props.path;
        const requestProps:RequestInit = {
            body: props.body ? JSON.stringify(props.body) : null,
            method: props.method,
            headers: new Headers([
                ["Bearer", localStorage.getItem("email")]
            ])
        };
        if (!props.showScreenWhileLoading) {
            dispatch(Loading);
        }
        /*TODO: Do we want to remove the previous request if a new one is issued whole screen will be loading so we won't have that case*/
        fetch(url, requestProps).then((rawResponse) => {
            const rawResponse2 = rawResponse.clone();
            rawResponse.json().then(response => {
                if (response.hasOwnProperty("email")) {
                    localStorage.setItem("email", response.email);
                }
                dispatch([props.resultAction, response]);
            }) .catch((err) => {
                console.error(err);
                rawResponse2.text().then((text) => {
                    dispatch([props.errorAction, text]);
                }).catch((e) => {
                    dispatch(props.errorAction);
                });
            })
        }).catch((e) => {
            console.error(e);
            dispatch(props.errorAction);
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
    console.log(state);
    if (isManagerState(state) && state.activeTab === "update") {
        return [subMapLocationSelected];
    }
    return [];
}
