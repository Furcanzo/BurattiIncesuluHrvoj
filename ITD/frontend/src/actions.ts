import {LineNumber, Product, State, TimeSlot} from "./models";
import {http} from "./requests";

export const ToggleTimeSlot = (state: any, timeSlot: TimeSlot) => {
    return state;
}

export const ToggleProduct = (state: any, product: Product) => {
    return state;
}

export const PreviousWeek = (state: any) => {

}

export const NextWeek = (state: any) => {

}

export const SelectDay = (state: any, date: Date) => {

}

export const Nothing = (state: any, ...args:any[]) => {
    return state;
}

export const SelectLineNumber = (state: any, lineNumber: LineNumber) => {

}

export const UpdateProduct = (state: any, product: Product) => {

}

export const DeleteProduct = (state: any, product: Product) => {

}

export const UpdateNewPassword = (state: State, newInput: string) => {
    return [state, http({path: "/me", errorAction: Loading, resultAction: UpdateProduct, body: {productId: 3}, method: "POST"})]

}
export const Loading = (state: State): State => {
    return {...state, loading: true};
}

export const Loaded = (state: State): State => {
    return {...state, loading: false}
}
