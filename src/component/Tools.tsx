import React, { ChangeEvent } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/store";
import {
  setLayersHitory,
  setLayersNow,
  setDrawables,
  setColor,
  setToolType,
  setImageFile,
} from "@/store/canvas";

import useLocalStorage from "@/hook/useLocalStorage";
import { ToolEnum, LocalStorageKey } from "@/utils/const";
import type { drawableInfoBufferType } from "@/utils/type";
import { isEmpty } from "underscore";

import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
} from "@mui/material";

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

  const [, setStoredDrawables] = useLocalStorage<drawableInfoBufferType>(
    LocalStorageKey.drawables,
    {}
  );

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) ?? null;
    if (file) {
      const filePath = URL.createObjectURL(file);
      dispatch(setImageFile(filePath));
      e.target.value = "";
    }
  };

  const initImage = () => {
    if (window.confirm("Remove image?")) {
      dispatch(setImageFile(""));
    }
  };

  const onChangeToolType = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as ToolEnum;
    if (TOOL_TYPES.includes(value) && value !== toolType)
      dispatch(setToolType(value));
  };

  const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColor(e.target.value));
  };

  const undo = () => {
    const prevIndex =
      layersNow > -1
        ? layersNow > layersHistory.length - 1
          ? layersHistory.length - 1
          : layersNow - 1
        : -1;

    dispatch(setLayersNow(prevIndex));
    dispatch(setDrawables(prevIndex > -1 ? layersHistory[prevIndex] : {}));
  };

  const redo = () => {
    const nextIndex =
      layersNow < layersHistory.length - 1
        ? layersNow + 1
        : layersHistory.length - 1;

    dispatch(setLayersNow(nextIndex));
    dispatch(setDrawables(nextIndex > -1 ? layersHistory[nextIndex] : {}));
  };

  const clearDrawables = () => {
    if (isEmpty(drawables)) return;

    const newLayersHistory = layersHistory.filter(
      (_, index) => index <= layersNow
    );
    newLayersHistory.push({});

    dispatch(setDrawables({}));
    dispatch(setLayersHitory(newLayersHistory));
    setStoredDrawables({});

    const nextIndex =
      layersNow + 1 < layersHistoryLimit - 1
        ? layersNow + 1
        : layersHistoryLimit - 1;
    dispatch(setLayersNow(nextIndex));
  };

  const resetLayers = () => {
    if (window.confirm("Are you sure to reset history?")) {
      setStoredDrawables({});
      dispatch(setDrawables({}));
      dispatch(setLayersHitory([]));
      dispatch(setLayersNow(-1));
    }
  };

  return (
    <div
      css={css`
        padding: 16px;
      `}
    >
      <div>
        <h3>Upload Image</h3>
        <div
          css={css`
            display: flex;
          `}
        >
          <input type="file" accept="image/*" onChange={uploadImage} />
          <Button onClick={initImage}>Remove Image</Button>
        </div>
      </div>
      <div>
        <h3>Drawing Tool</h3>
        <RadioGroup
          onChange={onChangeToolType}
          css={css`
            display: flex;
            flex-direction: row;
            gap: 8px;
          `}
        >
          {TOOL_TYPES.map((toolTypeValue) => (
            <FormControlLabel
              checked={toolType === toolTypeValue}
              value={toolTypeValue}
              label={toolTypeValue}
              control={<Radio />}
              key={`TOOL_TYPE_${toolTypeValue}`}
            />
          ))}
        </RadioGroup>
      </div>
      <div>
        <h3>Drawing Color</h3>
        <div>
          <TextField
            onChange={onChangeColor}
            value={color}
            InputProps={{ type: "color" }}
            css={css`
              width: 48px;
            `}
          />
        </div>
      </div>
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
          <Button onClick={clearDrawables} disabled={isEmpty(drawables)}>
            clear
          </Button>
          <Button onClick={resetLayers}>reset</Button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
