import {CustomerAppState} from "./models";
import {reserveView} from "./reserveView";
import {numbersView} from "./numbersView";

export const view = (state: CustomerAppState) => {
    if(state.newLineNumber) {
        return reserveView(state);
    }
    return numbersView(state);
}
