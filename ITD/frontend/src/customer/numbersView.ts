import {CustomerAppState} from "./models";
import {button, markerMap, qrCodeGenerator, row, text} from "../widgets";
import {lineNumberCard, lineNumberSelector} from "./widgets";
import {Nothing} from "../actions";
import {X_CIRCLE_FILL} from "../icons";
import {UnSelectDetails} from "./actions";

export const numbersView = ({myLineNumbers, showDetailsOf}: CustomerAppState) => {
    if (showDetailsOf) {
        return [
            row(lineNumberCard(showDetailsOf, Nothing)),
            row(qrCodeGenerator(showDetailsOf.id.toString())),
            markerMap(showDetailsOf.store.location, false),
            row(button([X_CIRCLE_FILL, text("Close")], "danger", UnSelectDetails)),
        ];
    }
    return [lineNumberSelector(myLineNumbers)];
}
