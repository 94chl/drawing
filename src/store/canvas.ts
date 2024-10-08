import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ToolEnum } from "@/utils/const";
import type { drawableInfoType, drawableInfoBufferType } from "@/utils/type";

type CanvasStateType = {
  toolType: ToolEnum;
  color: string;
  drawables: drawableInfoBufferType;
  selectedDrawableIds: Record<string, string>;
  layersHistory: drawableInfoBufferType[];
  layersNow: number;
  layersHistoryLimit: number;
  imageFile: string;
};

const initialState: CanvasStateType = {
  toolType: ToolEnum.rect,
  color: "#000000",
  drawables: {},
  selectedDrawableIds: {},
  layersHistory: [],
  layersNow: -1,
  layersHistoryLimit: 40,
  imageFile: "",
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
    addSelectedDrawableId: (state, { payload }: PayloadAction<string>) => {
      state.selectedDrawableIds[payload] = payload;
    },
    setSelectedDrawableIds: (
      state,
      { payload }: PayloadAction<Record<string, string>>
    ) => {
      state.selectedDrawableIds = payload;
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
    setImageFile: (state, { payload }: PayloadAction<string>) => {
      state.imageFile = payload;
    },
  },
});

export const {
  setToolType,
  setColor,
  setDrawable,
  setDrawables,
  addSelectedDrawableId,
  setSelectedDrawableIds,
  setLayersHitory,
  setLayersNow,
  setImageFile,
} = canvas.actions;
export default canvas.reducer;
