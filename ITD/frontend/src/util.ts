import {TimeSlot} from "./models";
import {Loader} from "@googlemaps/js-api-loader";
import {MAPS_API_KEY} from "./const";

export const timeSlotEq = (left: TimeSlot, right: TimeSlot) => {
    return left.start.minute === right.start.minute
        && left.start.hour == right.start.hour
        && left.end.minute === right.end.minute
        && left.end.hour == right.end.hour
        && left.day === right.day;
}

export const randInt = () => Math.floor(Math.random() * 100000);

export const onLoad = async () => {
    const loader = new Loader({
        apiKey: MAPS_API_KEY,
    });
    await loader.load();

}

export const debounce = (fn: () => void): void => {
    setTimeout(fn, 100);
}
export const currentYear = (new Date()).getFullYear();

export const addZero = (target: number) => target < 10 ? "0" + target.toString() : target.toString();
