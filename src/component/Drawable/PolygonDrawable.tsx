import React from "react";
import { Line } from "react-konva";

type Props = {
  color: string;
  points: number[];
};

const PolygonDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  color,
  points,
}) => <Line fill={color} points={points} closed opacity={0.3} />;

export default PolygonDrawable;
