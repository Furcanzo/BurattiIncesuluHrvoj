import {BASE_URL} from "./const";

export interface IHTTPOptions<State, Request, Response> {
    path: string;
    body?: Request;
    resultAction: (state: State, data: Response) => State;
    errorAction: (state: State) => State;
}

export const http = <State, Request, Response>(props: IHTTPOptions<State, Request, Response>) => [
    <State, Request, Response>(dispatch, props: IHTTPOptions<State, Request, Response>) => {
        const url = BASE_URL + props.path;
        const requestProps = props.body ? {
            body: JSON.stringify(props.body),
            method: "POST",
        } : {method: "GET"}
        fetch(url, requestProps).then((rawResponse) => {
            rawResponse.json().then(response => dispatch([props.resultAction, response])).catch(_ => dispatch(props.errorAction))
        }).catch(dispatch(props.errorAction));
    }, props];
