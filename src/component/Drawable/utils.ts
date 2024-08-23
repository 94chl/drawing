import { drawablePointsType } from "@/utils/type";
import { KonvaEventObject } from "konva/lib/Node";
import { Transform } from "konva/lib/Util";

export const setCursorStyle = (
  target: KonvaEventObject<MouseEvent>,
  cursor: string
) => {
  const node = target.currentTarget;
  const stage = node.getStage();
  if (stage) {
    const container = stage.container();
    container.style.cursor = cursor;
  }
};

const degreeToRadian = (degree: number): number => (Math.PI / 180) * degree;

export type transformedAttrsType = {
  draggable: boolean;
  fill: string;
  id: string;
  opacity: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  x: number;
  y: number;
};

export type transformedRectAttrsType = transformedAttrsType & {
  height: number;
  width: number;
};

const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;

export const getResizedRect = (transformedInfo: transformedRectAttrsType) => {
  const { x, y, width, height, scaleX, scaleY, rotation } = transformedInfo;
  const rotationFlag = Math.cos(degreeToRadian(rotation));
  const newWidth = width * (scaleX || 1);
  const newHeight = height * (scaleY || 1);
  const newX = Math.min(x, x + (rotationFlag || 0) * newWidth);
  const newY = Math.min(y, y + (rotationFlag || 0) * newHeight);
  return {
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.max(MIN_WIDTH, Math.round(Math.abs(newWidth))),
    height: Math.max(MIN_HEIGHT, Math.round(Math.abs(newHeight))),
  };
};

export type transformedEllipseAttrsType = transformedAttrsType & {
  radiusX: number;
  radiusY: number;
};

export const getResizedEllipse = (
  transformedInfo: transformedEllipseAttrsType
) => {
  const { x, y, radiusX, radiusY, scaleX, scaleY } = transformedInfo;
  const newRadiusX = Math.max(
    MIN_WIDTH,
    Math.round(Math.abs(radiusX * (scaleX || 1)))
  );
  const newRadiusY = Math.max(
    MIN_HEIGHT,
    Math.round(Math.abs(radiusY * (scaleY || 1)))
  );

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: newRadiusX * 2,
    height: newRadiusY * 2,
  };
};

export type transformedPolygonAttrsType = transformedAttrsType & {
  closed: boolean;
  points: number[];
  stroke: string;
  strokeWidth: number;
};

export const getResizedPolygon = ({
  targetPoints,
  transformObj,
}: {
  targetPoints: number[];
  transformObj: Transform;
}) => {
  const updatedPoints: drawablePointsType = [];
  for (let i = 0; i < targetPoints?.length; i += 2) {
    const point = transformObj.point({
      x: targetPoints[i],
      y: targetPoints[i + 1],
    });
    updatedPoints.push([Math.round(point.x), Math.round(point.y)]);
  }

  return updatedPoints;
};
