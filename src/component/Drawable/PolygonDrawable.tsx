import React, { useRef, useEffect } from "react";
import { Line, Transformer } from "react-konva";
import type { Line as LineType } from "konva/lib/shapes/Line";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";

import type { drawablePointsType } from "@/utils/type";
import { setCursorStyle } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";

type Props = {
  id: string;
  color: string;
  points: drawablePointsType;
  closed?: boolean;
  draggable: boolean;
  isSelected?: boolean;
};

const PolygonDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  points,
  closed = false,
  draggable,
  isSelected = false,
}) => {
  const moveDrawablePosition = useDragDrawablePosition({ id });

  const polygonRef = useRef<null | LineType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && polygonRef.current) {
      transformerRef.current.nodes([polygonRef.current]);
    }
  }, [isSelected]);

  return (
    <>
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
        ref={polygonRef}
      />
      {isSelected && <Transformer ref={transformerRef} ignoreStroke />}
    </>
  );
};

export default PolygonDrawable;
