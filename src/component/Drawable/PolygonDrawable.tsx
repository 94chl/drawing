import React, { useRef, useEffect } from "react";
import { Line, Transformer } from "react-konva";
import type { Line as LineType } from "konva/lib/shapes/Line";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { KonvaEventObject } from "konva/lib/Node";

import { getResizedPolygon, setCursorStyle } from "./utils";
import useDragDrawablePosition from "@/hook/useDragDrawablePosition";
import useTransformDrawable from "@/hook/useTransformDrawable";

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
  const transformDrawable = useTransformDrawable({ id });

  const polygonRef = useRef<null | LineType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    moveDrawablePosition(e);
    polygonRef.current?.position({ x: 0, y: 0 });
  };

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const targetPolygon = polygonRef.current;
    if (targetPolygon) {
      const targetPoints: number[] = e.currentTarget.attrs.points ?? [];
      const transformObj = e.currentTarget.getTransform();

      const updatedPoints = getResizedPolygon({ targetPoints, transformObj });

      transformDrawable({ points: updatedPoints });

      targetPolygon.scale({ x: 1, y: 1 });
      targetPolygon.rotation(0);
      targetPolygon.position({ x: 0, y: 0 });
    }
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
        onDragEnd={onDragEnd}
        onTransformStart={() => {
          setIsTransforming(true);
        }}
        onTransformEnd={onTransformEnd}
        ref={polygonRef}
      />
      {isSelected && (
        <Transformer ref={transformerRef} ignoreStroke rotateEnabled={false} />
      )}
    </>
  );
};

export default PolygonDrawable;
