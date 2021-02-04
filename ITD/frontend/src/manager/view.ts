import {ManagerAppState} from "./models";
import {monitoringView} from "./monitoringView";
import {manageStaffView} from "./manageStaffView";
import {updateStoreView} from "./updateStoreView";

export const view = (state: ManagerAppState) => {
    switch (state.activeTab) {
        case "monitor":
            return monitoringView(state);
        case "staff":
            return manageStaffView(state);
        case "update":
            return updateStoreView(state);
    }
}
