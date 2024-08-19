import React, { useRef, useEffect } from "react";
import { Ellipse, Transformer } from "react-konva";
import type { Ellipse as EllipseType } from "konva/lib/shapes/Ellipse";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";

import { setCursorStyle } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";

type Props = {
  id: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
  isSelected?: boolean;
};

const EllipseDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  x,
  y,
  width,
  height,
  draggable,
  isSelected = false,
}) => {
  const moveDrawablePosition = useDragDrawablePosition({ id });

  const ellipseRef = useRef<null | EllipseType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && ellipseRef.current) {
      transformerRef.current.nodes([ellipseRef.current]);
    }
  }, [isSelected]);

  return (
    <>
      <Ellipse
        id={id}
        radiusX={width / 2}
        radiusY={height / 2}
        fill={color}
        x={x}
        y={y}
        width={width}
        height={height}
        opacity={0.3}
        draggable={isSelected}
        onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
        onMouseLeave={(e) => setCursorStyle(e, "inherit")}
        onDragEnd={moveDrawablePosition}
        ref={ellipseRef}
      />
      {isSelected && <Transformer ref={transformerRef} ignoreStroke />}
    </>
  );
};

export default EllipseDrawable;
