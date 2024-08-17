import React from "react";
import { Ellipse } from "react-konva";

type Props = {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const EllipseDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  color,
  x,
  y,
  width,
  height,
}) => (
  <Ellipse
    radiusX={width / 2}
    radiusY={height / 2}
    fill={color}
    x={x + width / 2}
    y={y + height / 2}
    width={width}
    height={height}
    opacity={0.3}
  />
);

export default EllipseDrawable;
