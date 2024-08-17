import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { Stage as StageType } from "konva/lib/Stage";
import { Stage, Layer } from "react-konva";
import { RootState } from "@/store";
import { styled } from "@mui/material";

import useLocalStorage from "@/hook/useLocalStorage";
import type { drawableInfoType } from "@/utils/type";
import { ToolEnum } from "@/utils/const";

import { setLayersHitory, setLayersNow, setDrawables } from "@/store/canvas";

import { EllipseDrawable, RectDrawable, PolygonDrawable } from "./Drawable";

const Root = styled("div")`
  height: 100vh;
  width: 80vw;
`;

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
  const [drawablePoints, setDrawablePoints] = useState<number[]>([]);
  const [drawable, setDrawable] = useState<drawableInfoType>({
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

  const [storedLayersHistory, setStoredLayersHistory] = useLocalStorage<
    drawableInfoType[][]
  >("storedLayersHistory", []);
  const [storedLayersNow, setStoredLayersNow] = useLocalStorage(
    "storedLayersNow",
    -1
  );

  const initializeDrawable = () => {
    setDrawable({
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
      console.log("POINTER", pointerPosition);
      if (pointerPosition) {
        const element = stageRef.current?.getIntersection(pointerPosition);

        console.log("SELECT", element);
      }
      isDrawing.current = false;
    }
  };

  const finishDrawingDrawable = () => {
    if (!isDrawing.current) {
      initializeDrawable();
      return;
    }

    if (toolType === ToolEnum.select) {
      selectDrawable();
      return;
    }

    const newDrawables = [...drawables];
    const newLayersHistory =
      layersNow < layersHistoryLimit - 1
        ? layersHistory.filter((_, index) => index <= layersNow)
        : layersHistory.filter(
            (_, index) =>
              layersHistory.length - layersHistoryLimit + 1 <= index &&
              index < layersHistoryLimit
          );

    const newDrawable = {
      ...drawable,
      points: drawablePoints.slice(0, drawablePoints.length - 2),
    };
    console.log("NEW", newDrawable);
    if (
      (newDrawable.type === ToolEnum.ellipse ||
        newDrawable.type === ToolEnum.rect) &&
      (newDrawable.width < 1 || newDrawable.height < 1)
    ) {
      initializeDrawable();
      return;
    }
    newDrawables.push(newDrawable);

    dispatch(setDrawables(newDrawables));

    newLayersHistory.push(newDrawables);
    setStoredLayersHistory(newLayersHistory);
    dispatch(setLayersHitory(newLayersHistory));

    const nextIndex =
      layersNow + 1 < layersHistoryLimit - 1
        ? layersNow + 1
        : layersHistoryLimit - 1;
    setStoredLayersNow(nextIndex);
    dispatch(setLayersNow(nextIndex));

    initializeDrawable();
  };

  const drawingDrawable: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDrawing.current) {
      return;
    }

    const width = drawablePoints[0] - drawablePoints[drawablePoints.length - 2];
    const height =
      drawablePoints[1] - drawablePoints[drawablePoints.length - 1];
    const x =
      width < 0 ? drawablePoints[0] : drawablePoints[drawablePoints.length - 2];
    const y =
      height < 0
        ? drawablePoints[1]
        : drawablePoints[drawablePoints.length - 1];

    const newDrawable = {
      type: toolType,
      x,
      y,
      width: Math.abs(width),
      height: Math.abs(height),
      points: [...drawablePoints],
      color,
    };

    const newDrawablePoints = [
      ...drawablePoints.slice(
        0,
        drawablePoints.length > 2 ? drawablePoints.length - 2 : 2
      ),
      e.pageX,
      e.pageY,
    ];
    setDrawablePoints(newDrawablePoints);
    newDrawable.points = newDrawablePoints;

    if (drawable.type === ToolEnum.polygon && newDrawablePoints.length > 2) {
      finishDrawingDrawable();
      return;
    }

    setDrawable(newDrawable);
  };

  const startDrawDrawable: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDrawing.current === false) {
      isDrawing.current = true;
      drawingDrawable(e);
    } else {
      initializeDrawable();
    }
  };

  const Drawable = ({ drawableInfo }: { drawableInfo: drawableInfoType }) => {
    const { type, color: color, x, y, width, height, points } = drawableInfo;
    switch (type) {
      case ToolEnum.ellipse:
        return (
          <EllipseDrawable
            color={color}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        );
      case ToolEnum.rect:
        return (
          <RectDrawable
            color={color}
            x={x}
            y={y}
            width={width}
            height={height}
          />
        );
      case ToolEnum.polygon:
        return <PolygonDrawable color={color} points={points} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const canvasWidth = canvasRef?.current?.clientWidth;
    const canvasHeight = canvasRef?.current?.clientHeight;

    console.log({ canvasWidth, canvasHeight });

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
    if (!layersHistory.length && storedLayersHistory.length) {
      dispatch(setLayersHitory(storedLayersHistory));
      dispatch(setLayersNow(storedLayersNow));
      dispatch(
        setDrawables(
          !storedLayersHistory[storedLayersNow]
            ? []
            : storedLayersHistory[storedLayersNow]
        )
      );
    }
  }, []);

  useEffect(() => {
    if (!storedLayersHistory[storedLayersNow])
      setStoredLayersNow(storedLayersHistory.length - 1);

    if (!layersHistory.length && storedLayersHistory.length) {
      dispatch(setLayersHitory(storedLayersHistory));
      dispatch(setLayersNow(storedLayersNow));
      dispatch(
        setDrawables(
          !storedLayersHistory[storedLayersNow]
            ? []
            : storedLayersHistory[storedLayersNow]
        )
      );
    }
  }, [
    dispatch,
    layersHistory,
    setStoredLayersNow,
    storedLayersHistory,
    storedLayersNow,
  ]);

  return (
    <Root
      ref={canvasRef}
      onMouseMove={drawingDrawable}
      onMouseDown={startDrawDrawable}
      onMouseUp={finishDrawingDrawable}
      onKeyDown={(e) => e.key === "Escape" && initializeDrawable()}
    >
      <Stage
        ref={stageRef}
        width={canvasContainer.width}
        height={canvasContainer.height}
      >
        <Layer>
          {drawables.map((drawableInfo, index) => {
            const key = `${drawableInfo.type}_${index}`;
            console.log("drawableInfo", drawableInfo);
            return <Drawable drawableInfo={drawableInfo} key={key} />;
          })}

          <Drawable drawableInfo={drawable} />
        </Layer>
      </Stage>
    </Root>
  );
};

export default Canvas;
