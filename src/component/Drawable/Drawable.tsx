import React from "react";

import type { drawableInfoType } from "@/utils/type";
import { ToolEnum } from "@/utils/const";

import EllipseDrawable from "./EllipseDrawable";
import RectDrawable from "./RectDrawable";
import PolygonDrawable from "./PolygonDrawable";

type Props = {
  drawableInfo: drawableInfoType;
  toolType: ToolEnum;
  selectedDrawableIds?: Set<string>;
};

const INITIAL_SELECTED_DRAWABLE_IDS = new Set();

const Drawable: React.FC<React.PropsWithChildren<Props>> = ({
  drawableInfo,
  toolType,
  selectedDrawableIds = INITIAL_SELECTED_DRAWABLE_IDS,
}) => {
  const { id, type, color, x, y, width, height, points } = drawableInfo;
  const isSelectTool = toolType === ToolEnum.select;
  const isSelected = isSelectTool && selectedDrawableIds.has(id);
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
        />
      );
    case ToolEnum.polygon: {
      const startPoint = points[0];
      const endPoint =
        points.length > 1 ? points[points.length - 1] : startPoint;
      const isClosed =
        points.length > 1 &&
        startPoint[0] === endPoint[0] &&
        startPoint[1] === endPoint[1];
      return (
        <PolygonDrawable
          id={id}
          color={color}
          points={points}
          draggable={isSelectTool}
          closed={isClosed}
          isSelected={isSelected}
        />
      );
    }
    default:
      return null;
  }
};

export default Drawable;
