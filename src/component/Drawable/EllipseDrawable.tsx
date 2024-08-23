import React, { useRef, useEffect } from "react";
import { Ellipse, Transformer } from "react-konva";
import type { Ellipse as EllipseType } from "konva/lib/shapes/Ellipse";
import type { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import { KonvaEventObject } from "konva/lib/Node";

import { setCursorStyle, getResizedEllipse } from "./utils";
import type { transformedEllipseAttrsType } from "./utils";
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

const EllipseDrawable: React.FC<React.PropsWithChildren<Props>> = ({
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

  const ellipseRef = useRef<null | EllipseType>(null);
  const transformerRef = useRef<null | TransformerType>(null);

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const targetEllipse = ellipseRef.current;
    if (targetEllipse) {
      const transformedInfo: transformedEllipseAttrsType =
        e.currentTarget.attrs;
      const updatedDrawable = getResizedEllipse(transformedInfo);
      transformDrawable({
        ...updatedDrawable,
      });

      targetEllipse.scale({ x: 1, y: 1 });
      targetEllipse.rotation(0);
    }
    setIsTransforming(false);
  };

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
        onTransformStart={() => {
          setIsTransforming(true);
        }}
        onTransformEnd={onTransformEnd}
        ref={ellipseRef}
      />
      {isSelected && (
        <Transformer ref={transformerRef} ignoreStroke rotateEnabled={false} />
      )}
    </>
  );
};

export default EllipseDrawable;
