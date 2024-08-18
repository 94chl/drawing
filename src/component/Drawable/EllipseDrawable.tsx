import React from "react";
import { Ellipse } from "react-konva";

import { setCursorStyle } from "./utils";

type Props = {
  id: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
};

const EllipseDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  x,
  y,
  width,
  height,
  draggable,
}) => (
  <Ellipse
    id={id}
    radiusX={width / 2}
    radiusY={height / 2}
    fill={color}
    x={x + width / 2}
    y={y + height / 2}
    width={width}
    height={height}
    opacity={0.3}
    draggable={draggable}
    onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
    onMouseLeave={(e) => setCursorStyle(e, "inherit")}
  />
);

export default EllipseDrawable;
