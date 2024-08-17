import { createSlice } from "@reduxjs/toolkit";

import { ToolEnum } from "@/utils/const";
import type { drawableInfoType } from "@/utils/type";

type CanvasStateType = {
  toolType: ToolEnum;
  color: string;
  drawables: drawableInfoType[];
  layersHistory: drawableInfoType[][];
  layersNow: number;
  layersHistoryLimit: number;
};

const initialState: CanvasStateType = {
  toolType: ToolEnum.rect,
  color: "#000000",
  drawables: [],
  layersHistory: [],
  layersNow: -1,
  layersHistoryLimit: 40,
};

const canvas = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setToolType: (state, { payload }) => {
      state.toolType = payload;
    },
    setColor: (state, { payload }) => {
      state.color = payload.value;
    },
    setDrawables: (state, { payload }) => {
      state.drawables = payload;
    },
    setLayersHitory: (state, { payload }) => {
      state.layersHistory = payload;
    },
    setLayersNow: (state, { payload }) => {
      state.layersNow = payload;
    },
  },
});

export const {
  setToolType,
  setColor,
  setDrawables,
  setLayersHitory,
  setLayersNow,
} = canvas.actions;
export default canvas.reducer;
