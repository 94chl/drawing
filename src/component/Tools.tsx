import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/store";
import {
  setLayersHitory,
  setLayersNow,
  setDrawables,
  setColor,
  setToolType,
} from "@/store/canvas";

import useLocalStorage from "@/hook/useLocalStorage";
import { ToolEnum } from "@/utils/const";
import type { drawableInfoType } from "@/utils/type";

import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";

const TOOL_TYPES = Object.values(ToolEnum);

const Tools = () => {
  const dispatch = useDispatch();

  const {
    drawables,
    toolType,
    color,
    layersHistory,
    layersNow,
    layersHistoryLimit,
  } = useSelector((store: RootState) => store.canvas, shallowEqual);

  const [storedLayersHistory, setStoredLayersHistory] = useLocalStorage<
    drawableInfoType[][]
  >("storedLayersHistory", []);
  const [storedLayersNow, setStoredLayersNow] = useLocalStorage(
    "storedLayersNow",
    -1
  );

  const onChangeToolType = (e: React.MouseEvent, value: ToolEnum) => {
    dispatch(setToolType(value));
  };

  // const onChangeColor = (e) => {
  //   dispatch(setColor(e.target.value));
  // };

  const undo = () => {
    const prevIndex =
      layersNow >= 0
        ? layersNow > layersHistory.length - 1
          ? layersHistory.length - 1
          : layersNow - 1
        : -1;

    setStoredLayersNow(prevIndex);
    dispatch(setLayersNow(prevIndex));
    dispatch(setDrawables(prevIndex > -1 ? layersHistory[prevIndex] : []));
  };

  const redo = () => {
    const nextIndex =
      layersNow < layersHistory.length - 1
        ? layersNow + 1
        : layersHistory.length - 1;

    setStoredLayersNow(nextIndex);
    dispatch(setLayersNow(nextIndex));
    dispatch(setDrawables(nextIndex > -1 ? layersHistory[nextIndex] : []));
  };

  const clearDrawables = () => {
    if (drawables.length < 1) return;

    const newLayersHistory = layersHistory.filter(
      (_, index) => index <= layersNow
    );
    newLayersHistory.push([]);

    dispatch(setDrawables([]));
    dispatch(setLayersHitory(newLayersHistory));
    setStoredLayersHistory(newLayersHistory);

    const nextIndex =
      layersNow + 1 < layersHistoryLimit - 1
        ? layersNow + 1
        : layersHistoryLimit - 1;
    dispatch(setLayersNow(nextIndex));
    setStoredLayersNow(nextIndex);
  };

  const resetLayers = () => {
    if (window.confirm("Are you sure to reset history?")) {
      setStoredLayersHistory([]);
      setStoredLayersNow(-1);
      dispatch(setDrawables([]));
      dispatch(setLayersHitory([]));
      dispatch(setLayersNow(-1));
    }
  };

  return (
    <div>
      <div>
        <h3>Drawing Tool</h3>
        <ToggleButtonGroup
          value={toolType}
          onChange={onChangeToolType}
          exclusive
        >
          {TOOL_TYPES.map((toolTypeValue) => (
            <ToggleButton
              value={toolTypeValue}
              selected={toolType === toolTypeValue}
              key={`TOOL_TYPE_${toolTypeValue}`}
            >
              {toolTypeValue}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      {/* <div>
        <h3>Drawing Option</h3>
        <div>
          <CustomInput
            inputId="fillColor"
            onChange={(e) => onChangeColor(e, 'fillColor')}
            value={fillColor}
            inputOption={{ type: 'color' }}
          >
            채우기 색상
          </CustomInput>
        </div>
      </div> */}
      <div>
        <h3>History</h3>
        <div>
          <Button onClick={undo} disabled={layersNow < 0}>
            undo
          </Button>
          <Button
            onClick={redo}
            disabled={layersNow >= layersHistory.length - 1}
          >
            redo
          </Button>
          <Button onClick={clearDrawables} disabled={drawables.length < 1}>
            clear
          </Button>
          <Button onClick={resetLayers}>reset</Button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
