import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawable } from "@/store/canvas";
import { isUndefined } from "underscore";

import useAddLayerHistory from "./useAddLayerHistory";
import { drawablePointsType } from "@/utils/type";

type Props = { id: string };

export type transformInfoType = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: drawablePointsType;
};

const useTransformDrawable = ({ id }: Props) => {
  const dispatch = useDispatch();
  const { drawables } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const addLayerHistory = useAddLayerHistory();

  const transformDrawable = ({
    x,
    y,
    width,
    height,
    points,
  }: transformInfoType) => {
    const targetDrawable = drawables[id];
    if (!targetDrawable) return;

    const newDrawable = structuredClone(targetDrawable);

    if (!isUndefined(x)) newDrawable.x = x;
    if (!isUndefined(y)) newDrawable.y = y;
    if (!isUndefined(width)) newDrawable.width = width;
    if (!isUndefined(height)) newDrawable.height = height;
    if (!isUndefined(points)) newDrawable.points = points;

    dispatch(setDrawable(newDrawable));

    const newDrawables = structuredClone(drawables);
    newDrawables[newDrawable.id] = newDrawable;

    addLayerHistory(newDrawables);
  };

  return transformDrawable;
};

export default useTransformDrawable;
