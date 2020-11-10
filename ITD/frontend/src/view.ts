import {LineNumber, LineNumberRequest, Product, ShopLocation, Time, TimeSlot} from "./models";
import {Nothing, SelectDay, ToggleProduct, ToggleTimeSlot} from "./actions";
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
    Color
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
    return navigationCard(navigation, row(cardBody));

}

export const estimatedStaySelector = (estimatedTime: Time) => {
    return form([
            card(titleText("Estimated time for visit:", "5"), row([
                smallColumn(formField(estimatedTime.hour.toString(), "Hours", Nothing, "number")),
                smallColumn(formField(estimatedTime.minute.toString(), "Minutes", Nothing, "number")),
            ]), "light"),
        ]
    )
}
const productCard = (product: Product, selected: boolean) => {
    return selectionCard(product.name, [ToggleProduct, product], selected, "dark");
}
export const productSelector = (products: Product[], selectedProducts: Product[]) => {
    return card(
        titleText("Please select the products/categories that you would like to visit:", "5"),
        row(products.map((product) => {
            return smallColumn(productCard(product, selectedProducts.includes(product)));
        })), "dark"
    )
}

export const lineNumbers = (lineNumbers: LineNumber[]) => {

}
