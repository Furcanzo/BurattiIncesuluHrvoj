import {IServerTimeSlot, Time, TimeSlot} from "./models";
import {Loader} from "@googlemaps/js-api-loader";
import {BASE_URL, MAPS_API_KEY} from "./const";

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

export const getCurrentPath = () => "/" + (window.location.href.split(BASE_URL)[1]);

export const parseServerTimeSlot = ({start, end}: IServerTimeSlot): TimeSlot => {
    const result = new TimeSlot();
    const startDate = new Date(start);
    const endDate = new Date(end);
    result.day = new Date(start);
    result.day.setHours(0, 0, 0, 0); // Days are significant with their time
    result.start = new Time();
    result.start = {hour: startDate.getHours(), minute: startDate.getMinutes()};
    result.end = {hour: endDate.getHours(), minute: endDate.getMinutes()};
    return result;
}

export const serializeTimeSlotForServer = (slot: TimeSlot): IServerTimeSlot => {
    const startTime = new Date(slot.day);
    startTime.setHours(slot.start.hour, slot.start.minute);
    const endTime = new Date(slot.day);
    endTime.setHours(slot.end.hour, slot.end.minute);
    return {start: startTime.valueOf(), end: endTime.valueOf()};
}

export const readUserEmail = (): string => {
    return localStorage.getItem("email") || "";
}
export const writeUserEmail = (email: string) => {
    localStorage.setItem("email", email);
}
