import React from "react";
import { Line } from "react-konva";

import type { drawablePointsType } from "@/utils/type";

type Props = {
  color: string;
  points: drawablePointsType;
};

const PolygonDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  color,
  points,
}) => <Line fill={color} points={points.flat()} closed opacity={0.3} />;

export default PolygonDrawable;
