import {ManagerAppState} from "./models";
import {button, card, centered, confirmationPrompt, formField, row, titleText} from "../widgets";
import {
    AddNewPartnerStore,
    CancelPartnerStoreAddition, LoadUpdateStoreTab,
    SaveStore,
    UpdateStoreCapacity,
    UpdateStoreName
} from "./actions";


const updateStoreView = ( {foundPartnerStore, updatingStore}: ManagerAppState) => {
    if (foundPartnerStore) {
        return confirmationPrompt(
            `Would you like to add store ${foundPartnerStore.name} (id: ${foundPartnerStore.id} as a partner store?`,
            AddNewPartnerStore,
            {
                confirm: {label: "Yes", className: "btn-success"},
                cancel: {label: "Cancel", className: "btn-danger"}
            }, CancelPartnerStoreAddition);
    }
    return [
        titleText("Update Store Details ", "2"),
        centered(card(titleText("Please update the details regarding the store below", "4"), [
            row([
                formField(updatingStore.name, "Store Name", UpdateStoreName, "text"),
            ]),
            row([
                formField(updatingStore.maxCustomerCapacity.toString(), "Store's maximum capacity", UpdateStoreCapacity, "number"),
            ]),

            row([
                button("Create", "primary", SaveStore),
                button("Clear", "danger", LoadUpdateStoreTab),
            ].map(centered)),
        ])),
    ]

}
