import React from "react";

import type { drawableInfoType } from "@/utils/type";
import { ToolEnum } from "@/utils/const";

import EllipseDrawable from "./EllipseDrawable";
import RectDrawable from "./RectDrawable";
import PolygonDrawable from "./PolygonDrawable";

type Props = {
  drawableInfo: drawableInfoType;
  toolType: ToolEnum;
  selectedDrawableIds?: Record<string, string>;
  setIsTransforming: (value: boolean) => void;
};

const INITIAL_SELECTED_DRAWABLE_IDS: Record<string, string> = {};

const Drawable: React.FC<React.PropsWithChildren<Props>> = ({
  drawableInfo,
  toolType,
  selectedDrawableIds = INITIAL_SELECTED_DRAWABLE_IDS,
  setIsTransforming,
}) => {
  const { id, type, color, x, y, width, height, points } = drawableInfo;
  const isSelectTool = toolType === ToolEnum.select;
  const isSelected = isSelectTool && !!selectedDrawableIds[id];
  switch (type) {
    case ToolEnum.ellipse:
      return (
        <EllipseDrawable
          id={id}
          color={color}
          x={x}
          y={y}
          width={width}
          height={height}
          draggable={isSelectTool}
          isSelected={isSelected}
          setIsTransforming={setIsTransforming}
        />
      );
    case ToolEnum.rect:
      return (
        <RectDrawable
          id={id}
          color={color}
          x={x}
          y={y}
          width={width}
          height={height}
          draggable={isSelectTool}
          isSelected={isSelected}
          setIsTransforming={setIsTransforming}
        />
      );
    case ToolEnum.polygon: {
      const startPoint = points[0];
      const endPoint =
        points.length > 1 ? points[points.length - 1] : startPoint;
      const distance = Math.sqrt(
        (startPoint[0] - endPoint[0]) ** 2 + (startPoint[1] - endPoint[1]) ** 2
      );
      const isClosed = points.length > 1 && distance <= 4;
      return (
        <PolygonDrawable
          id={id}
          color={color}
          points={points.flat()}
          closed={isClosed}
          draggable={isSelectTool}
          isSelected={isSelected}
          setIsTransforming={setIsTransforming}
        />
      );
    }
    default:
      return null;
  }
};

export default Drawable;
