import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawable, setLayersHitory, setLayersNow } from "@/store/canvas";
import { KonvaEventObject } from "konva/lib/Node";

import useLocalStorage from "./useLocalStorage";
import type { drawableInfoBufferType } from "@/utils/type";
import { LocalStorageKey } from "@/utils/const";

type Props = {
  id: string;
};

const useDragDrawablePosition = ({ id }: Props) => {
  const dispatch = useDispatch();
  const { drawables, layersNow, layersHistoryLimit, layersHistory } =
    useSelector((store: RootState) => store.canvas, shallowEqual);

  const [, setStoredDrawables] = useLocalStorage<drawableInfoBufferType>(
    LocalStorageKey.drawables,
    {}
  );

  const moveDrawablePosition = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.currentTarget.position();
    const targetDrawable = drawables[id];

    if (!targetDrawable) return;

    const { x: prevX, y: prevY } = targetDrawable;

    if (x !== prevX || y !== prevY) {
      const newDrawable = structuredClone(targetDrawable);
      newDrawable.x = x;
      newDrawable.y = y;
      dispatch(setDrawable(newDrawable));

      const newDrawables = structuredClone(drawables);
      newDrawables[newDrawable.id] = newDrawable;
      setStoredDrawables(newDrawables);

      const newLayersHistory =
        layersNow < layersHistoryLimit - 1
          ? layersHistory.filter((_, index) => index <= layersNow)
          : layersHistory.filter(
              (_, index) =>
                layersHistory.length - layersHistoryLimit + 1 <= index &&
                index < layersHistoryLimit
            );
      const nextIndex =
        layersNow + 1 < layersHistoryLimit - 1
          ? layersNow + 1
          : layersHistoryLimit - 1;

      dispatch(setLayersHitory(newLayersHistory));
      dispatch(setLayersNow(nextIndex));
    }
  };

  return moveDrawablePosition;
};

export default useDragDrawablePosition;
