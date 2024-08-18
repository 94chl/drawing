import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ToolEnum } from "@/utils/const";
import type { drawableInfoType, drawableInfoBufferType } from "@/utils/type";

type CanvasStateType = {
  toolType: ToolEnum;
  color: string;
  drawables: drawableInfoBufferType;
  layersHistory: drawableInfoBufferType[];
  layersNow: number;
  layersHistoryLimit: number;
};

const initialState: CanvasStateType = {
  toolType: ToolEnum.rect,
  color: "#000000",
  drawables: {},
  layersHistory: [],
  layersNow: -1,
  layersHistoryLimit: 40,
};

const canvas = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setToolType: (state, { payload }: PayloadAction<ToolEnum>) => {
      state.toolType = payload;
    },
    setColor: (state, { payload }: PayloadAction<string>) => {
      state.color = payload;
    },
    setDrawable: (state, { payload }: PayloadAction<drawableInfoType>) => {
      state.drawables[payload.id] = payload;
    },
    setDrawables: (
      state,
      { payload }: PayloadAction<drawableInfoBufferType>
    ) => {
      state.drawables = payload;
    },
    setLayersHitory: (
      state,
      { payload }: PayloadAction<drawableInfoBufferType[]>
    ) => {
      state.layersHistory = payload;
    },
    setLayersNow: (state, { payload }: PayloadAction<number>) => {
      state.layersNow = payload;
    },
  },
});

export const {
  setToolType,
  setColor,
  setDrawable,
  setDrawables,
  setLayersHitory,
  setLayersNow,
} = canvas.actions;
export default canvas.reducer;
