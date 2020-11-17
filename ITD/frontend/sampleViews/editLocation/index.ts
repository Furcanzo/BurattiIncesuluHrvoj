import "core-js/stable";
import "regenerator-runtime/runtime";
import {app} from "hyperapp";
import {
    titleText,
    navbar,
    row,
    wrapper,
    button,
    card,
    formField,
    centered,
    largeColumn, inlineForm
} from "../../src/widgets";
import {DeleteProduct, Nothing, UpdateProduct} from "../../src/actions";
import {bakery, managerNavigation} from "../sampleData";

const layout = (state = undefined) => {
    const menu = navbar(managerNavigation, Nothing);
    return wrapper(menu, [
        centered(card(titleText("Edit Location", "2"), [
            row(formField(bakery.name, "Name", Nothing, "text")),
            row(formField(bakery.timeout.toString(), "Customer Ticket Timeout (minutes)", Nothing, "number")),
            row(centered(card(titleText("Products"), largeColumn([...bakery.products.map(product => {
                return inlineForm(row([
                    formField(product.name, "", (state, ev) => UpdateProduct(state, {...product, name: (ev.target as HTMLInputElement).value})),
                    button("Update", "success", Nothing),
                    button("x", "danger", (state) => DeleteProduct(state, product))
                ]));
            }),
                card(titleText("New Product", "5"), [
                    inlineForm(row(formField("", "Name: ", Nothing))),
                    row(centered(button("Add", "success", Nothing))),
                ]),
            ])))),
            row([
                button("Save", "success", Nothing),
                button("Discard Changes", "danger", Nothing),
            ].map(centered))
        ])),
    ]);
}
app({
    init: {},
    node: document.getElementById("app"),
    view: layout,
})
