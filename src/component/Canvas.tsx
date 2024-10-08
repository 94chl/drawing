import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { Stage as StageType } from "konva/lib/Stage";
import { Stage, Layer, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import genUid from "light-uid";
import _ from "underscore";

import { RootState } from "@/store";
import {
  setLayersHitory,
  setLayersNow,
  setDrawable,
  setDrawables,
  addSelectedDrawableId,
  setSelectedDrawableIds,
} from "@/store/canvas";

import useLocalStorage from "@/hook/useLocalStorage";
import useUndoRedo from "@/hook/useUndoRedo";
import useAddLayerHistory from "@/hook/useAddLayerHistory";
import type {
  drawableInfoType,
  drawablePointsType,
  drawableInfoBufferType,
} from "@/utils/type";
import {
  ToolEnum,
  STANDARD_DRAWABLES,
  LocalStorageKey,
  KeyboardKeyEnum,
} from "@/utils/const";

import Drawable from "./Drawable/Drawable";

const Canvas = () => {
  const dispatch = useDispatch();
  const {
    toolType,
    color,
    drawables,
    selectedDrawableIds,
    layersHistory,
    imageFile,
  } = useSelector((store: RootState) => store.canvas, shallowEqual);

  const [canvasContainer, setCanvasContainer] = useState({
    width: 40,
    height: 40,
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
  const isDrawing = useRef(false);
  const isTrasforming = useRef(false);
  const isDrawableTool = [
    ToolEnum.ellipse,
    ToolEnum.rect,
    ToolEnum.polygon,
  ].includes(toolType);
  const isStandardDrawableType = STANDARD_DRAWABLES.includes(toolType);
  const isPolygon = toolType === ToolEnum.polygon;

  const [storedDrawables] = useLocalStorage<drawableInfoBufferType>(
    LocalStorageKey.drawables,
    {}
  );
  const { undo, redo } = useUndoRedo();
  const addLayerHistory = useAddLayerHistory();

  const imageObject = useMemo(() => {
    const imageInfo = new window.Image();
    imageInfo.src = imageFile;

    return imageInfo;
  }, [imageFile]);

  const initializeDrawable = useCallback(() => {
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
  }, [color, toolType]);

  const setIsTransforming = (value: boolean) => {
    isTrasforming.current = value;
  };

  const selectDrawable = (e: KonvaEventObject<MouseEvent>) => {
    if (isTrasforming.current) return;

    if (stageRef?.current) {
      const pointerPosition = stageRef.current?.getPointerPosition();
      if (pointerPosition) {
        const element = stageRef.current?.getIntersection(pointerPosition);
        if (element) {
          const targetId = element.getAttr("id");
          if (targetId) {
            const isCtrlKey = e.evt.ctrlKey;
            if (!isCtrlKey && !selectedDrawableIds[targetId])
              dispatch(setSelectedDrawableIds({}));
            dispatch(addSelectedDrawableId(targetId));
            isDrawing.current = false;
            return;
          }
        }
        dispatch(setSelectedDrawableIds({}));
      }
      isDrawing.current = false;
    }
  };

  const removeDrawable = useCallback(() => {
    if (!_.isEmpty(selectedDrawableIds)) {
      const newDrawables = structuredClone(drawables);
      Object.values(selectedDrawableIds).forEach((id) => {
        delete newDrawables[id];
      });
      dispatch(setSelectedDrawableIds({}));
      dispatch(setDrawables(newDrawables));

      addLayerHistory(newDrawables);

      isDrawing.current = false;
    }
  }, [addLayerHistory, dispatch, drawables, selectedDrawableIds]);

  const finishDrawingDrawable = () => {
    if (!isDrawing.current) {
      initializeDrawable();
      return;
    }

    const newDrawable = {
      ...tempDrawable,
      id: genUid(8),
    };

    if (isPolygon) {
      const newDrawablePoints = structuredClone(drawablePoints);
      newDrawablePoints.push(
        tempDrawable.points[tempDrawable.points.length - 1]
      );

      if (drawablePoints.length < 3) {
        newDrawable.points = newDrawablePoints;
        setDrawablePoints(newDrawablePoints);
        setTempDrawable(newDrawable);
        return;
      }

      const startPoint = newDrawablePoints[0];
      const endPoint = newDrawablePoints[newDrawablePoints.length - 1];
      const distance = Math.sqrt(
        (startPoint[0] - endPoint[0]) ** 2 + (startPoint[1] - endPoint[1]) ** 2
      );

      if (distance > 10) {
        newDrawable.points = newDrawablePoints;
        setDrawablePoints(newDrawablePoints);
        setTempDrawable(newDrawable);
        return;
      }

      newDrawablePoints.pop();
      newDrawablePoints.push(drawablePoints[0]);
      newDrawable.points = newDrawablePoints;
      setDrawablePoints(newDrawablePoints);
    }

    if (
      isStandardDrawableType &&
      (newDrawable.width < 1 || newDrawable.height < 1)
    ) {
      initializeDrawable();
      return;
    }
    dispatch(setDrawable(newDrawable));

    const newDrawables = structuredClone(drawables);
    newDrawables[newDrawable.id] = newDrawable;

    addLayerHistory(newDrawables);

    initializeDrawable();
  };

  const drawDrawable = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    if (isPolygon && _.isEmpty(drawablePoints)) return;

    const x = e.evt.clientX;
    const y = e.evt.clientY;
    const width = drawablePoints[0][0] - x;
    const height = drawablePoints[0][1] - y;
    const startPointX = width < 0 ? drawablePoints[0][0] : x;
    const startPointY = height < 0 ? drawablePoints[0][1] : y;
    const isEllipse = toolType === ToolEnum.ellipse;
    const newX = isEllipse ? startPointX + Math.abs(width) / 2 : startPointX;
    const newY = isEllipse ? startPointY + Math.abs(height) / 2 : startPointY;

    const newDrawable: drawableInfoType = {
      id: tempDrawable.id,
      type: toolType,
      x: newX,
      y: newY,
      width: Math.abs(width),
      height: Math.abs(height),
      points: [...drawablePoints, [x, y]],
      color,
    };

    setTempDrawable(newDrawable);
  };

  const startDrawDrawable = (e: KonvaEventObject<MouseEvent>) => {
    if (toolType === ToolEnum.select) {
      selectDrawable(e);
      return;
    }

    isDrawing.current = true;

    if (_.isEmpty(drawablePoints)) {
      const x = e.evt.clientX;
      const y = e.evt.clientY;
      const newDrawable: drawableInfoType = {
        ...tempDrawable,
        type: toolType,
        points: [[x, y]],
        color,
      };

      setTempDrawable(newDrawable);
      if (isStandardDrawableType) setDrawablePoints([[x, y]]);
    }
  };

  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrlKey = e.ctrlKey;
      const isShifKey = e.shiftKey;
      switch (key) {
        case KeyboardKeyEnum.escape: {
          if (isDrawing.current) initializeDrawable();
          break;
        }
        case KeyboardKeyEnum.delete:
        case KeyboardKeyEnum.backspace: {
          removeDrawable();
          break;
        }
        case KeyboardKeyEnum.z: {
          if (isCtrlKey && !isShifKey) {
            undo();
          }
          if (isCtrlKey && isShifKey) {
            redo();
          }
          break;
        }
        default:
          break;
      }
    },
    [initializeDrawable, redo, removeDrawable, undo]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
    };
  }, [onKeyDownHandler]);

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

  useEffect(() => {
    if (!_.isEmpty(selectedDrawableIds)) {
      const diffSelectedIds = Object.values(selectedDrawableIds).filter(
        (id) => !drawables[id]
      );
      if (!_.isEmpty(diffSelectedIds)) dispatch(setSelectedDrawableIds({}));
    }
  }, [dispatch, drawables, selectedDrawableIds]);

  return (
    <div
      css={css`
        height: 100vh;
        width: 80vw;
        cursor: ${isDrawableTool ? "crosshair" : "default"};
        overflow: hidden;
      `}
      ref={canvasRef}
    >
      <Stage
        ref={stageRef}
        width={canvasContainer.width}
        height={canvasContainer.height}
        onMouseMove={drawDrawable}
        onMouseDown={startDrawDrawable}
        onMouseUp={finishDrawingDrawable}
      >
        <Layer>
          {imageFile && (
            <Image
              image={imageObject}
              width={canvasContainer.width}
              height={canvasContainer.height}
            ></Image>
          )}
          {Object.values(drawables).map((drawableInfo, index) => {
            const key = `${drawableInfo.type}_${index}`;
            return (
              <Drawable
                drawableInfo={drawableInfo}
                toolType={toolType}
                key={key}
                selectedDrawableIds={selectedDrawableIds}
                setIsTransforming={setIsTransforming}
              />
            );
          })}

          {!_.isEmpty(tempDrawable.points) && (
            <Drawable
              drawableInfo={tempDrawable}
              toolType={toolType}
              setIsTransforming={setIsTransforming}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
