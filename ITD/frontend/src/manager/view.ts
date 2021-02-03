import {ManagerAppState} from "./models";
import {
    button,
    card,
    centered,
    column,
    confirmationPrompt,
    formField,
    markerMap,
    row,
    text,
    titleText
} from "../widgets";
import {
    AddNewPartnerStore,
    CancelPartnerStoreAddition, LoadUpdateStoreTab,
    SaveStore,
    UpdateStoreCapacity,
    UpdateStoreName, UpdateStoreOpeningHours
} from "./actions";
import {UpdateVisitTimeField} from "../customer/actions";


const updateStoreView = ({foundPartnerStore, updatingStore}: ManagerAppState) => {
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

            centered(card(titleText("Opening Hours", "4"), [
                row([
                    column(titleText("Opens At:", "5")),
                    column([
                        formField(updatingStore.workingHours.start.hour.toString(), "", UpdateStoreOpeningHours("hour", "start"), "number"),
                        text(":"),
                        formField(updatingStore.workingHours.start.minute.toString(), "", UpdateStoreOpeningHours("minute", "start"), "number")
                    ]),
                    column([]),
                ]),
                row([
                    column(titleText("Closes At:", "5")),
                    column([
                        formField(updatingStore.workingHours.end.hour.toString(), "", UpdateStoreOpeningHours("hour", "end"), "number"),
                        text(":"),
                        formField(updatingStore.workingHours.end.minute.toString(), "", UpdateStoreOpeningHours("minute", "end"), "number")
                    ]),
                    column([]),
                ]),

            ], "secondary")),
            centered(card("", [
                titleText("Update Store Location", "5"),
                markerMap(updatingStore.location, true),
            ])),
            row([
                button("Save", "primary", SaveStore),
                button("Clear", "danger", LoadUpdateStoreTab),
            ].map(centered)),
        ])),
    ]

}
