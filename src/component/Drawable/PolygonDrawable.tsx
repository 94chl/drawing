import React from "react";
import { Line } from "react-konva";

import type { drawablePointsType } from "@/utils/type";
import { setCursorStyle } from "./utils";

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
}) => (
  <Line
    id={id}
    fill={color}
    points={points.flat()}
    opacity={0.3}
    closed={closed}
    draggable={draggable}
    onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
    onMouseLeave={(e) => setCursorStyle(e, "inherit")}
  />
);

export default PolygonDrawable;
