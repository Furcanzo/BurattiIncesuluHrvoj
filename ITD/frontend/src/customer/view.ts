import {CustomerAppState} from "./models";
import {reserveView} from "./reserveView";
import {numbersView} from "./numbersView";
import {loadingWidget} from "../widgets";

export const view = (state: CustomerAppState) => {
    if (state.loading) {
        return loadingWidget();
    }
    if(state.newLineNumber || state.lineNumberReserved) {
        return reserveView(state);
    }
    return numbersView(state);
}
