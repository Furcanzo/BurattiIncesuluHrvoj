import {LineNumber, LineNumberRequest, Time, TimeSlot} from "../models";
import {
    card,
    column,
    titleText,
    navigationCard,
    row,
    clickable,
    formField,
    smallColumn,
    Color, centered
} from "../widgets";
import {addZero, timeSlotEq} from "../util";
import {CHECK_CIRCLE, CIRCLE} from "../icons";
import {
    NextWeek,
    PrevWeek,
    SelectDayOfTimeSlot,
    SelectStore,
    SelectTimeSlot,
    ShowDetailsOf,
    UpdateVisitTimeField
} from "./actions";
import {storeCard} from "./reserveView";

const selectionCard = (title: string, onClick: any, selected: boolean, border: Color = "primary") => {
    return clickable(card(
        titleText(title, "5"),
        selected ? CHECK_CIRCLE : CIRCLE,
        selected ? border : null,
        onClick
    ));
}

export const timeStr = (time: Time) => `${addZero(time.hour)}:${addZero(time.minute)}`;
export const timeSlotCard = (timeSlot: TimeSlot, selected: boolean) => {
    return selectionCard(`${timeStr(timeSlot.start)} - ${timeStr(timeSlot.end)}`, SelectTimeSlot(timeSlot), selected);
}

export const dateStr = (date: Date): string => `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

export const dateTimeSlotSelection = (lineNumberRequest: LineNumberRequest) => {
    const selectedTimeSlot = lineNumberRequest.time;
    if(!lineNumberRequest.selectedWeekSlot) {
        debugger;
    }
    const dates = [0, 1, 2, 3, 4, 5, 6].map((additionalDay) => {
        const oldMilisecs = lineNumberRequest.selectedWeekSlot.getTime();
        const newMilisecs = oldMilisecs + (24 * 60 * 60 * 1000) * additionalDay;
        return new Date(newMilisecs);
    })
    const selectedDate = lineNumberRequest.selectedDateSlot;
    const currentSlots = selectedDate ? lineNumberRequest.potentialTimeSlots.filter((timeSlot) => selectedDate === timeSlot.day) : [];
    const navigation = [
        {
            active: false,
            title: "<<",
            onClick: PrevWeek,
        },
        ...dates.map((date) => {
            return {
                active: !!selectedDate && dateStr(selectedDate) === dateStr(date),
                title: dateStr(date),
                onClick: SelectDayOfTimeSlot(date),
            }
        }),
        {
            active: false,
            title: ">>",
            onClick: NextWeek,
        }

    ]
    let cardBody;
    if (currentSlots.length > 0 && selectedDate) {
        cardBody = currentSlots.map((slot) => {
            const selected = !!selectedTimeSlot && timeSlotEq(slot, selectedTimeSlot);
            return smallColumn([timeSlotCard(slot, selected)]);
        });
    } else if (selectedDate) {
        cardBody = [titleText("There are no time slots available for the slot that you selected.")]
        if (lineNumberRequest.store.partners.length > 0) {
            const storeCards = lineNumberRequest.store.partners.map(store => storeCard(store, SelectStore(store)))
            cardBody = [...cardBody, titleText("However following partner stores are available:"), ...storeCards];
        }
    } else {
        cardBody = titleText(`Select a date to view the timeslots available!`, "4");
    }
    return centered(navigationCard(navigation, row(cardBody)));

}

export const estimatedStaySelector = (estimatedTime: Time) => {
    return centered(card(titleText("How much time do you plan on spending in the store?", "5"), row([
        column([]),
        column(formField(estimatedTime.hour.toString(), "Hours", UpdateVisitTimeField("hour"), "number")),
        column(formField(estimatedTime.minute.toString(), "Minutes", UpdateVisitTimeField("minute"), "number")),
        column([]),
    ]), "secondary"));
}

export const lineNumberCard = (lineNumber: LineNumber, action) => {
    return clickable(card(
        titleText(lineNumber.number.toString(), "2"),
        [
            titleText(lineNumber.store.name),
            titleText(`${timeStr(lineNumber.time.start)} - ${timeStr(lineNumber.time.end)}`, "4"),
            titleText(dateStr(lineNumber.time.day), "4"),
        ],
        "primary",
        action(lineNumber)
    ))
}

const lineNumberSort = (a: LineNumber, b: LineNumber): number => {
    if (a.time.day !== b.time.day) {
        return a.time.day.valueOf() - b.time.day.valueOf();
    }
    if (a.time.start.hour !== b.time.start.hour) {
        return a.time.start.hour - b.time.start.hour;
    }
    return a.time.start.minute - b.time.start.minute;
}
export const lineNumberSelector = (lineNumbers: LineNumber[]) => {
    return centered(card(
        titleText("My Line Numbers:", "2"),
        row(lineNumbers.sort(lineNumberSort).map(lineNumber => {
            return smallColumn(lineNumberCard(lineNumber, ShowDetailsOf))
        })),
    ));
}

