import { ToolEnum } from "./const";

export type drawableInfoType = {
  type: ToolEnum;
  x: number;
  y: number;
  width: number;
  height: number;
  points: number[];
  color: string;
};
