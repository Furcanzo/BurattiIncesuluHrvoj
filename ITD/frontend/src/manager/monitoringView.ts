import {ManagerAppState} from "./models";
import {button, card, row, text, titleText} from "../widgets";
import {RELOAD} from "../icons";
import {RefreshMonitoringData} from "./actions";

export const monitoringView = ({store, numberOfVisitors, lastUpdatedVisitors}: ManagerAppState) => {
    return card(titleText("Current Customers", "3"), [
        row(titleText(`${numberOfVisitors} / ${store.maxCustomerCapacity}`, "1")),
        row(text(`Last updated at: ${lastUpdatedVisitors.toLocaleString()}`)),
        row(button(RELOAD, "success", RefreshMonitoringData, "lg", true)),
    ], "primary")
}
