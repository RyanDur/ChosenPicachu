export type Point = {readonly x: number; readonly y: number};

export type Box = Point & {readonly label: string; readonly width: number; readonly height: number};

const leftMiddle = ({x, y, height}: Box): Point => ({x, y: y + height / 2});
const rightMiddle = ({x, y, width, height}: Box): Point => ({x: x + width, y: y + height / 2});
const topMiddle = ({x, y, width}: Box): Point => ({x: x + width / 2, y});
const bottomMiddle = ({x, y, width, height}: Box): Point => ({x: x + width / 2, y: y + height});

export const edges = {leftMiddle, rightMiddle, topMiddle, bottomMiddle};
