import React, { useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";
import type { Rect as RectType } from "konva/lib/shapes/Rect";
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

const RectDrawable: React.FC<React.PropsWithChildren<Props>> = ({
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

  const rectRef = useRef<null | RectType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && rectRef.current) {
      transformerRef.current.nodes([rectRef.current]);
    }
  }, [isSelected]);

  return (
    <>
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
        onDragEnd={moveDrawablePosition}
        ref={rectRef}
      />
      {isSelected && <Transformer ref={transformerRef} ignoreStroke />}
    </>
  );
};

export default RectDrawable;
