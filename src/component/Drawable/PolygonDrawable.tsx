import React, { useRef, useEffect } from "react";
import { Line, Transformer } from "react-konva";
import type { Line as LineType } from "konva/lib/shapes/Line";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";

import { setCursorStyle } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";

type Props = {
  id: string;
  color: string;
  points: number[];
  closed?: boolean;
  draggable: boolean;
  isSelected?: boolean;
  setIsTransforming: (value: boolean) => void;
};

const PolygonDrawable: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  color,
  points,
  closed = false,
  draggable,
  isSelected = false,
  setIsTransforming,
}) => {
  const moveDrawablePosition = useDragDrawablePosition({ id });

  const polygonRef = useRef<null | LineType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  const onTransformEnd = () => {
    setIsTransforming(false);
  };

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
        points={points}
        stroke={"#000"}
        strokeWidth={3}
        opacity={0.3}
        closed={closed}
        draggable={isSelected}
        onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
        onMouseLeave={(e) => setCursorStyle(e, "inherit")}
        onDragEnd={moveDrawablePosition}
        onTransformStart={() => {
          setIsTransforming(true);
        }}
        onTransformEnd={onTransformEnd}
        ref={polygonRef}
      />
      {isSelected && <Transformer ref={transformerRef} ignoreStroke />}
    </>
  );
};

export default PolygonDrawable;
