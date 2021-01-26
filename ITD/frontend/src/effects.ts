import {BASE_URL} from "./const";
import {Loaded, Loading} from "./actions";

export interface IHTTPOptions<State, Request, Response> {
    path: string;
    body?: Request;
    resultAction: (state: State, data: Response) => State;
    errorAction: (state: State) => State;
    method: "GET" | "POST" | "DELETE" | "PUT" ;// TODO: Add more if needed
}
export const http = <State, Request, Response>(props: IHTTPOptions<State, Request, Response>) => [
    async <State, Request, Response>(dispatch, props: IHTTPOptions<State, Request, Response>) => {
        const url = BASE_URL + props.path;
        const requestProps = {
            body: props.body ? JSON.stringify(props.body) : null,
            method: props.method,
        };
        dispatch(Loading);
        /*TODO: Do we want to remove the previous request if a new one is issued whole screen will be loading so we won't have that case*/
        try {

            const rawResponse = await fetch(url, requestProps);
            const response = await rawResponse.json();
            dispatch([props.resultAction, response]);
        } catch (e){
            console.error(e);
            dispatch(props.errorAction);
        }
        dispatch(Loaded);
    }, props];
