import React from "react";

import type { drawableInfoType } from "@/utils/type";
import { ToolEnum } from "@/utils/const";

import EllipseDrawable from "./EllipseDrawable";
import RectDrawable from "./RectDrawable";
import PolygonDrawable from "./PolygonDrawable";

type Props = { drawableInfo: drawableInfoType };

const Drawable: React.FC<React.PropsWithChildren<Props>> = ({
  drawableInfo,
}) => {
  const { type, color, x, y, width, height, points } = drawableInfo;
  switch (type) {
    case ToolEnum.ellipse:
      return (
        <EllipseDrawable
          color={color}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      );
    case ToolEnum.rect:
      return (
        <RectDrawable color={color} x={x} y={y} width={width} height={height} />
      );
    case ToolEnum.polygon:
      return <PolygonDrawable color={color} points={points} />;
    default:
      return null;
  }
};

export default Drawable;
