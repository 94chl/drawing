import { ToolEnum } from "./const";

export type drawablePointsType = [number, number][];

export type drawableInfoType = {
  id: string;
  type: ToolEnum;
  x: number;
  y: number;
  width: number;
  height: number;
  points: drawablePointsType;
  color: string;
};
