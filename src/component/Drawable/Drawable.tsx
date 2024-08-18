import React from "react";

import type { drawableInfoType } from "@/utils/type";
import { ToolEnum } from "@/utils/const";

import EllipseDrawable from "./EllipseDrawable";
import RectDrawable from "./RectDrawable";
import PolygonDrawable from "./PolygonDrawable";

type Props = { drawableInfo: drawableInfoType; toolType: ToolEnum };

const Drawable: React.FC<React.PropsWithChildren<Props>> = ({
  drawableInfo,
  toolType,
}) => {
  const { id, type, color, x, y, width, height, points } = drawableInfo;
  const draggable = toolType === ToolEnum.select;
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
          draggable={draggable}
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
          draggable={draggable}
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
          draggable={draggable}
          closed={isClosed}
        />
      );
    }
    default:
      return null;
  }
};

export default Drawable;
