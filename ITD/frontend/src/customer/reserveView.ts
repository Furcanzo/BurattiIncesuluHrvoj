import {CustomerAppState} from "./models";
import {LineNumber, LineNumberRequest} from "../models";
import {alertBar, button, card, clickable, largeColumn, markerMap, row, text, titleText} from "../widgets";
import {
    BookLineNumber, GetLineNumbers,
    SelectStore,
    SendLineNumberRequest,
    ShowDetailsOf, SubmitStore,
    UnSelectStore,
    UnSelectTimeSlot
} from "./actions";
import {dateStr, dateTimeSlotSelection, estimatedStaySelector, lineNumberCard, timeStr} from "./widgets";
import {CHECK_CIRCLE, PATCH_CHECK, PLUS_CIRCLE_FILL, X_CIRCLE_FILL} from "../icons";

export const reserveView = ({newLineNumber, lineNumberReserved}: CustomerAppState) => {

    if (!newLineNumber.store) {
        // Store selection

        let result = storeSelector(newLineNumber);
        if (newLineNumber.previousErrored) {
            result = [
                alertBar("The store is currently not available, please pick another one:", "danger"),
                ...result
            ];
        }
        return result;
    }
    if (!newLineNumber.potentialTimeSlots) {
        // Store selected show detail screen
        return storeDetails(newLineNumber);
    }
    if (!newLineNumber.time) {
        // Store confirmed, select timeslots
        let result = dateTimeSlotSelection(newLineNumber);
        if (newLineNumber.previousErrored) {
            result = [
                alertBar("The timeslot you selected is currently not available, please pick another one", "danger"),
                ...result,
            ]
        }
        return result;
    }
    if (!lineNumberReserved) {
        // Fill details
        return lineNumberDetailsForm(newLineNumber);
    }

    return scheduleSuccess(lineNumberReserved);
    // Confirmed

}

const storeSelector = ({potentialStores}: LineNumberRequest) => {
    return potentialStores.map(store => {
        return row(largeColumn([storeCard(store, SelectStore)]));
    });
}

export const storeCard = (store, action) => {
    return clickable(card(
        titleText(store.name, "4"),
        [
            titleText("Open between: " + timeStr(store.workingHours.start) + " - " + timeStr(store.workingHours.end), "4"),
        ],
        "primary",
        action(store),
    ))
}
const storeDetails = ({store}: LineNumberRequest) => {
    return [card(
        titleText(store.name, "2"),
        [
            markerMap(store.location, false),
            titleText("Opens at: " + timeStr(store.workingHours.start), "3"),
            titleText("Closes at: " + timeStr(store.workingHours.end), "3"),
            titleText("(The opening hours are valid for each day)", "3"),
        ]
    ),
        row([
            button(text([CHECK_CIRCLE, "Continue"]), "success", SubmitStore),
            button(text([X_CIRCLE_FILL, "Cancel"]), "danger", UnSelectStore),
        ])
    ]
}

const lineNumberDetailsForm = ({store, time, estimatedTimeOfVisit}: LineNumberRequest) => {
    return [
        estimatedStaySelector(estimatedTimeOfVisit),
        row([
            button([CHECK_CIRCLE, text("Schedule")], "success", SendLineNumberRequest),
            button([X_CIRCLE_FILL, text("Cancel")], "danger", UnSelectTimeSlot),
        ])
    ];
}

const scheduleSuccess = (reservedLineNumber: LineNumber) => {
    return [
        titleText([PATCH_CHECK, text("Booking Successful!")], "1"),
        lineNumberCard(reservedLineNumber, GetLineNumbers)
    ]
}
