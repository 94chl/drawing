import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawables, setLayersNow } from "@/store/canvas";
import { KonvaEventObject } from "konva/lib/Node";

import useLocalStorage from "./useLocalStorage";
import type { drawableInfoBufferType } from "@/utils/type";

type Props = {
  id: string;
};

const useDragDrawablePosition = ({ id }: Props) => {
  const dispatch = useDispatch();
  const { drawables, layersNow, layersHistoryLimit, layersHistory } =
    useSelector((store: RootState) => store.canvas, shallowEqual);
  const [, setStoredLayersHistory] = useLocalStorage<drawableInfoBufferType[]>(
    "storedLayersHistory",
    []
  );
  const [, setStoredLayersNow] = useLocalStorage("storedLayersNow", -1);

  const moveDrawablePosition = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.currentTarget.position();
    const targetDrawable = drawables[id];

    if (!targetDrawable) return;

    const { x: prevX, y: prevY } = targetDrawable;

    if (x !== prevX || y !== prevY) {
      const newDrawable = structuredClone(targetDrawable);
      newDrawable.x = x;
      newDrawable.y = y;
      dispatch(setDrawables(newDrawable));

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
      setStoredLayersNow(nextIndex);
      dispatch(setLayersNow(nextIndex));
      setStoredLayersHistory(newLayersHistory);
    }
  };

  return moveDrawablePosition;
};

export default useDragDrawablePosition;
