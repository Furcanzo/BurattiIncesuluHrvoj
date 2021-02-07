import {ManagerAppState} from "./models";
import {
    button,
    card,
    centered,
    column,
    confirmationPrompt,
    formField, formTextArea, inlineForm,
    largeColumn,
    markerMap,
    row, smallColumn, spread,
    text,
    titleText
} from "../widgets";
import {
    AddNewPartnerStore,
    CancelPartnerStoreAddition,
    FindPartnerStore,
    LoadUpdateStoreTab,
    RemovePartnerStore,
    SaveStore,
    UpdatePartnerStoreId,
    UpdateStoreCapacity, UpdateStoreDescription,
    UpdateStoreName,
    UpdateStoreOpeningHours, UpdateStoreTimeout
} from "./actions";

export const updateStoreView = ({foundPartnerStore, updatingStore, newPartnerStoreId}: ManagerAppState) => {
    if (foundPartnerStore) {
        return confirmationPrompt(
            `Would you like to add store ${foundPartnerStore.name} (id: ${foundPartnerStore.id}) as a partner store?`,
            AddNewPartnerStore,
            {
                confirm: {label: "Yes", className: "btn-success"},
                cancel: {label: "Cancel", className: "btn-danger"}
            }, CancelPartnerStoreAddition);
    }
    const canAddPartnerStore = newPartnerStoreId > 0 && updatingStore.partners.filter(store => store.id === newPartnerStoreId).length === 0 && newPartnerStoreId !== updatingStore.id;
    return [
        titleText(`Update Store Details (id: ${updatingStore.id})`, "2"),
        centered(card(titleText("Please update the details regarding the store below", "4"), [
            row([
                formField(updatingStore.name, "Store Name", UpdateStoreName, "text", true),
            ]),
            row([
                formTextArea(updatingStore.description, "Store Description", UpdateStoreDescription, true),
            ]),
            row([
                column(formField(updatingStore.maxCustomerCapacity.toString(), "Store's maximum capacity", UpdateStoreCapacity, "number")),
                column(formField(updatingStore.timeoutMinutes.toString(), "Ticket Timespan (minutes)", UpdateStoreTimeout, "number")),
            ]),

            centered(card(titleText("Opening Hours", "4"), [
                row([
                    smallColumn(titleText("Opens At:", "5")),
                    spread(column([
                        formField(updatingStore.workingHours.start.hour.toString(), "", UpdateStoreOpeningHours("hour", "start"), "number"),
                    ])),
                    column([]),
                ]),
                row([
                    smallColumn(titleText("Closes At:", "5")),
                    spread(column([
                        formField(updatingStore.workingHours.end.hour.toString(), "", UpdateStoreOpeningHours("hour", "end"), "number"),
                    ])),
                    column([]),
                ]),

            ], "secondary")),
            centered(card(text(""), [
                titleText("Update Store Location", "5"),
                markerMap(updatingStore.location, true),
            ])),

            row(centered(card(titleText("Partner Stores"), largeColumn([...updatingStore.partners.map(store => {
                return row([
                    titleText(store.name, "5"), text(`(Id: ${store.id})`),
                    button("x", "danger", RemovePartnerStore(store))
                ]);
            }),
                card(titleText("New Partner Store", "4"), [
                    inlineForm(row(formField(newPartnerStoreId.toString(), "Store ID:", UpdatePartnerStoreId, "number"))),
                    row(centered(button("Add", "success", FindPartnerStore, "md", false, !canAddPartnerStore))),
                ]),
            ])))),
            row([
                button("Save", "primary", SaveStore),
                button("Clear", "danger", LoadUpdateStoreTab),
            ].map(centered)),
        ])),
    ]

}
