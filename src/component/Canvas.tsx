import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { Stage as StageType } from "konva/lib/Stage";
import { Stage, Layer } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { RootState } from "@/store";
import genUid from "light-uid";
import _ from "underscore";

import useLocalStorage from "@/hook/useLocalStorage";
import type {
  drawableInfoType,
  drawablePointsType,
  drawableInfoBufferType,
} from "@/utils/type";
import { ToolEnum, STANDARD_DRAWABLES, LocalStorageKey } from "@/utils/const";

import {
  setLayersHitory,
  setLayersNow,
  setDrawable,
  setDrawables,
} from "@/store/canvas";

import Drawable from "./Drawable/Drawable";

const Canvas = () => {
  const dispatch = useDispatch();
  const {
    drawables,
    toolType,
    color,
    layersHistory,
    layersNow,
    layersHistoryLimit,
  } = useSelector((store: RootState) => store.canvas, shallowEqual);

  const [canvasContainer, setCanvasContainer] = useState({
    width: 0,
    height: 0,
  });
  const [drawablePoints, setDrawablePoints] = useState<drawablePointsType>([]);
  const [tempDrawable, setTempDrawable] = useState<drawableInfoType>({
    id: "",
    type: toolType,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    points: [],
    color,
  });

  const canvasRef = useRef<null | HTMLDivElement>(null);
  const stageRef = useRef<null | StageType>(null);
  const selectedDrawableIds = useRef<Set<string>>(new Set());
  const isDrawing = useRef(false);
  const isDrawableTool = [
    ToolEnum.ellipse,
    ToolEnum.rect,
    ToolEnum.polygon,
  ].includes(toolType);

  const [storedDrawables, setStoredDrawables] =
    useLocalStorage<drawableInfoBufferType>(LocalStorageKey.drawables, {});

  const initializeDrawable = () => {
    setTempDrawable({
      id: "",
      type: toolType,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      points: [],
      color,
    });
    setDrawablePoints([]);
    isDrawing.current = false;
  };

  const selectDrawable = () => {
    if (stageRef?.current) {
      const pointerPosition = stageRef.current?.getPointerPosition();
      if (pointerPosition) {
        const element = stageRef.current?.getIntersection(pointerPosition);

        if (element) {
          selectedDrawableIds.current.clear();
          selectedDrawableIds.current.add(element.getAttr("id"));
        } else {
          selectedDrawableIds.current.clear();
        }
      }
      isDrawing.current = false;
    }
  };

  const finishDrawingDrawable = () => {
    if (!isDrawing.current) {
      initializeDrawable();
      return;
    }

    const newDrawable = {
      ...tempDrawable,
      points: drawablePoints.slice(0, drawablePoints.length - 2),
      id: genUid(8),
    };
    if (
      STANDARD_DRAWABLES.includes(newDrawable.type) &&
      (newDrawable.width < 1 || newDrawable.height < 1)
    ) {
      initializeDrawable();
      return;
    }
    dispatch(setDrawable(newDrawable));

    const newDrawables = structuredClone(drawables);
    newDrawables[newDrawable.id] = newDrawable;
    setStoredDrawables(newDrawables);

    const newLayersHistory =
      layersNow < layersHistoryLimit - 1
        ? layersHistory.filter((_, index) => index <= layersNow)
        : layersHistory.filter(
            (_, index) =>
              layersHistory.length - layersHistoryLimit + 1 <= index &&
              index < layersHistoryLimit
          );
    newLayersHistory.push(newDrawables);

    const nextIndex =
      layersNow + 1 < layersHistoryLimit - 1
        ? layersNow + 1
        : layersHistoryLimit - 1;

    dispatch(setLayersHitory(newLayersHistory));
    dispatch(setLayersNow(nextIndex));

    initializeDrawable();
  };

  const drawingDrawable = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;

    const x = e.evt.clientX;
    const y = e.evt.clientY;
    const width = drawablePoints.length > 1 ? drawablePoints[0][0] - x : 0;
    const height = drawablePoints.length > 1 ? drawablePoints[0][1] - y : 0;
    const startPointX = width < 0 ? drawablePoints[0][0] : x;
    const startPointY = height < 0 ? drawablePoints[0][1] : y;

    const newDrawable = {
      id: tempDrawable.id,
      type: toolType,
      x: startPointX,
      y: startPointY,
      width: Math.abs(width),
      height: Math.abs(height),
      points: [...drawablePoints],
      color,
    };

    const newDrawablePoints: drawablePointsType = [...drawablePoints, [x, y]];
    setDrawablePoints(newDrawablePoints);
    newDrawable.points = newDrawablePoints;

    setTempDrawable(newDrawable);
  };

  const startDrawDrawable = (e: KonvaEventObject<MouseEvent>) => {
    if (toolType === ToolEnum.select) {
      selectDrawable();
      return;
    }

    if (isDrawing.current === false) {
      isDrawing.current = true;
      drawingDrawable(e);
    } else {
      initializeDrawable();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContainer({
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    const canvasWidth = canvasRef?.current?.clientWidth;
    const canvasHeight = canvasRef?.current?.clientHeight;

    if (canvasWidth && canvasHeight) {
      const canvasResize = () => {
        setCanvasContainer({
          width: canvasWidth,
          height: canvasHeight,
        });
      };

      window.addEventListener("resize", canvasResize);
      return () => window.removeEventListener("resize", canvasResize);
    }
  }, []);

  useEffect(() => {
    if (_.isEmpty(layersHistory) && !_.isEmpty(storedDrawables)) {
      dispatch(setDrawables(storedDrawables));
      dispatch(setLayersHitory([storedDrawables]));
      dispatch(setLayersNow(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      css={css`
        height: 100vh;
        width: 80vw;
        cursor: ${isDrawableTool ? "crosshair" : "default"};
      `}
      ref={canvasRef}
      onKeyDown={(e) => e.key === "Escape" && initializeDrawable()}
    >
      <Stage
        ref={stageRef}
        width={canvasContainer.width}
        height={canvasContainer.height}
        onMouseMove={drawingDrawable}
        onMouseDown={startDrawDrawable}
        onMouseUp={finishDrawingDrawable}
      >
        <Layer>
          {Object.values(drawables).map((drawableInfo, index) => {
            const key = `${drawableInfo.type}_${index}`;
            return (
              <Drawable
                drawableInfo={drawableInfo}
                toolType={toolType}
                key={key}
                selectedDrawableIds={selectedDrawableIds.current}
              />
            );
          })}

          {!_.isEmpty(drawablePoints) && (
            <Drawable drawableInfo={tempDrawable} toolType={toolType} />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
