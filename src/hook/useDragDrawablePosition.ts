import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawable } from "@/store/canvas";
import { KonvaEventObject } from "konva/lib/Node";

import useAddLayerHistory from "./useAddLayerHistory";
import { drawablePointsType } from "@/utils/type";
import { STANDARD_DRAWABLES } from "@/utils/const";

type Props = {
  id: string;
};

const useDragDrawablePosition = ({ id }: Props) => {
  const dispatch = useDispatch();
  const { drawables } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const addLayerHistory = useAddLayerHistory();

  const moveDrawablePosition = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.currentTarget.position();
    const targetDrawable = drawables[id];

    if (!targetDrawable) return;

    const { x: prevX, y: prevY } = targetDrawable;

    if (x !== prevX || y !== prevY) {
      const newDrawable = structuredClone(targetDrawable);
      const isStandardDrawable = STANDARD_DRAWABLES.includes(newDrawable.type);

      if (isStandardDrawable) {
        newDrawable.x = x;
        newDrawable.y = y;
      }

      const newPoints: drawablePointsType = newDrawable.points.map(
        ([pointX, pointY]) => [pointX + x, pointY + y]
      );

      newDrawable.points = newPoints;
      dispatch(setDrawable(newDrawable));

      const newDrawables = structuredClone(drawables);
      newDrawables[newDrawable.id] = newDrawable;

      addLayerHistory(newDrawables);
    }
  };

  return moveDrawablePosition;
};

export default useDragDrawablePosition;
