import React from "react";
import { Rect } from "react-konva";

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

const RectDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  x,
  y,
  width,
  height,
  draggable,
}) => {
  return (
    <Rect
      id={id}
      fill={color}
      x={x}
      y={y}
      width={width}
      height={height}
      opacity={0.3}
      draggable={draggable}
      onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
      onMouseLeave={(e) => setCursorStyle(e, "inherit")}
      onDragEnd={(e) => {
        const test = e.currentTarget.position();
        console.log("TEST", test);
      }}
    />
  );
};

export default RectDrawable;
