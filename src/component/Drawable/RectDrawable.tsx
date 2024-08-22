import React, { useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";
import type { Rect as RectType } from "konva/lib/shapes/Rect";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { KonvaEventObject } from "konva/lib/Node";

import { setCursorStyle, getResizedRect } from "./utils";
import type { transformedRectAttrsType } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";
import useTransformDrawable from "@/hook/useTransformDrawable";

type Props = {
  id: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  draggable: boolean;
  isSelected?: boolean;
  setIsTransforming: (value: boolean) => void;
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
  setIsTransforming,
}) => {
  const moveDrawablePosition = useDragDrawablePosition({ id });
  const transformDrawable = useTransformDrawable({ id });

  const rectRef = useRef<null | RectType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const targetRect = rectRef.current;
    if (targetRect) {
      const transformedInfo: transformedRectAttrsType = e.currentTarget.attrs;
      const updatedDrawable = getResizedRect(transformedInfo);
      transformDrawable(updatedDrawable);

      targetRect.scale({ x: 1, y: 1 });
      targetRect.rotation(0);
    }
    setIsTransforming(false);
  };

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
        draggable={isSelected}
        onMouseEnter={(e) => draggable && setCursorStyle(e, "grab")}
        onMouseLeave={(e) => setCursorStyle(e, "inherit")}
        onDragEnd={moveDrawablePosition}
        onTransformStart={() => {
          setIsTransforming(true);
        }}
        onTransformEnd={onTransformEnd}
        ref={rectRef}
      />
      {isSelected && (
        <Transformer ref={transformerRef} keepRatio={false} ignoreStroke />
      )}
    </>
  );
};

export default RectDrawable;
