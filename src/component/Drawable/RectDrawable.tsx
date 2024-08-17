import React from "react";
import { Rect } from "react-konva";

type Props = {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const RectDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  color,
  x,
  y,
  width,
  height,
}) => (
  <Rect fill={color} x={x} y={y} width={width} height={height} opacity={0.3} />
);

export default RectDrawable;
