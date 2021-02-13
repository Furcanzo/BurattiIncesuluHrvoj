export const getRandomText = () => Math.random().toString(36).substring(7);
export const getRandomNumber = () => Math.floor(Math.random() * 10000000);
export const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

