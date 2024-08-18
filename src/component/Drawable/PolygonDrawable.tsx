import React from "react";
import { Line } from "react-konva";

import type { drawablePointsType } from "@/utils/type";
import { setCursorStyle } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";

type Props = {
  id: string;
  color: string;
  points: drawablePointsType;
  closed?: boolean;
  draggable: boolean;
};

const PolygonDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  points,
  closed = false,
  draggable,
}) => {
  const moveDrawablePosition = useDragDrawablePosition({ id });

  return (
    <Line
      id={id}
      fill={color}
      points={points.flat()}
      opacity={0.3}
      closed={closed}
      draggable={draggable}
      onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
      onMouseLeave={(e) => setCursorStyle(e, "inherit")}
      onDragEnd={moveDrawablePosition}
    />
  );
};

export default PolygonDrawable;
