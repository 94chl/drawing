import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawable } from "@/store/canvas";

import useAddLayerHistory from "./useAddLayerHistory";

type Props = { id: string };

const useTransformDrawable = ({ id }: Props) => {
  const dispatch = useDispatch();
  const { drawables } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const addLayerHistory = useAddLayerHistory();

  const trasnformDrawable = (transformedInfo: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const targetDrawable = drawables[id];
    if (!targetDrawable) return;
    const newDrawable = {
      ...structuredClone(targetDrawable),
      ...transformedInfo,
    };
    dispatch(setDrawable(newDrawable));

    const newDrawables = structuredClone(drawables);
    newDrawables[newDrawable.id] = newDrawable;

    addLayerHistory(newDrawables);
  };

  return trasnformDrawable;
};

export default useTransformDrawable;
