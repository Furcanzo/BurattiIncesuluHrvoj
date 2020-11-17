import {LineNumber, LineNumberRequest, Product, ShopLocation, Time, TimeSlot} from "./models";
import {Nothing, SelectDay, SelectLineNumber, ToggleProduct, ToggleTimeSlot} from "./actions";
import {
    card,
    column,
    titleText,
    navigationCard,
    row,
    clickable,
    form,
    formField,
    button,
    smallColumn,
    Color, centered
} from "./widgets";
import {addZero, timeSlotEq} from "./util";
import {CHECK_CIRCLE, CIRCLE} from "./icons";

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
    return selectionCard(`${timeStr(timeSlot.start)} - ${timeStr(timeSlot.end)}`, [ToggleTimeSlot, timeSlot], selected);
}

export const dateStr = (date: Date): string => `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

export const dateTimeSlotSelection = (lineNumberRequest: LineNumberRequest, dates: Date[], selectedDate ?: Date) => {
    const selectedTimeSlot = lineNumberRequest.time;
    const currentSlots = selectedDate ? lineNumberRequest.location.openTimeSlots.filter((timeSlot) => selectedDate === timeSlot.day) : [];
    const navigation = [
        {
            active: false,
            title: "<<",
            onClick: Nothing,
        },
        ...dates.map((date) => {
            return {
                active: !!selectedDate && dateStr(selectedDate) === dateStr(date),
                title: dateStr(date),
                onClick: [SelectDay, date],
            }
        }),
        {
            active: false,
            title: ">>",
            onClick: Nothing,
        }

    ]
    let cardBody;
    if (currentSlots.length > 0) {
        cardBody = currentSlots.map((slot) => {
            const selected = !!selectedTimeSlot && timeSlotEq(slot, selectedTimeSlot);
            return smallColumn([timeSlotCard(slot, selected)]);
        });
    } else {
        cardBody = titleText(`Select a date to view the timeslots available!`, "4");
    }
    return centered(navigationCard(navigation, row(cardBody)));

}

export const estimatedStaySelector = (estimatedTime: Time) => {
    return centered(card(titleText("Estimated time for visit:", "5"), row([
                column([]),
                column(formField(estimatedTime.hour.toString(), "Hours", Nothing, "number")),
                column(formField(estimatedTime.minute.toString(), "Minutes", Nothing, "number")),
                column([]),
            ]), "secondary"));
}
const productCard = (product: Product, selected: boolean) => {
    return selectionCard(product.name, [ToggleProduct, product], selected, "dark");
}
export const productSelector = (products: Product[], selectedProducts: Product[]) => {
    return centered(card(
        titleText("Please select the products/categories that you would like to visit:", "5"),
        row(products.map((product) => {
            return smallColumn(productCard(product, selectedProducts.includes(product)));
        })), "dark"
    ));
}

const lineNumberCard = (lineNumber: LineNumber) => {
    return clickable(card(
        titleText(lineNumber.number.toString(), "2"),
        [
            titleText(lineNumber.location.name),
            titleText(`${timeStr(lineNumber.time.start)} - ${timeStr(lineNumber.time.end)}`, "4"),
            titleText(dateStr(lineNumber.time.day), "4"),
        ],
        "primary",
        [SelectLineNumber, LineNumber]
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
            return smallColumn(lineNumberCard(lineNumber))
        })),
    ));
}
