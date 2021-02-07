import {alertBar, button, card, centered, formField, row, titleText} from "../widgets";
import {CreateStoreAppState} from "./models";
import {CreateStorePage, SubmitStore, UpdateStoreField} from "./actions";


export const view = (state: CreateStoreAppState) => {
    const newStore = state.newStore;
    const created = state.lastCreatedStore ?
        [alertBar(`Created store ${state.lastCreatedStore.name}`, "success")] : [];
    return [
        ...created,
        titleText("Create New Store ", "2"),
        centered(card(titleText("Please fill the form below", "4"), [
            row([
                formField(newStore.managerEmail, "Manager's email address", UpdateStoreField("managerEmail"), "email"),
            ]),
            row([
                formField(newStore.name, "Store's name", UpdateStoreField("name"), "text"),
            ]),

            row([
                button("Create", "primary", SubmitStore),
                button("Clear", "danger", CreateStorePage),
            ].map(centered)),
        ])),
    ]
}

