import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawables, setLayersNow } from "@/store/canvas";

import useLocalStorage from "./useLocalStorage";
import type { drawableInfoBufferType } from "@/utils/type";
import { LocalStorageKey } from "@/utils/const";

const useUndoRedo = () => {
  const dispatch = useDispatch();
  const { layersNow, layersHistory } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const [, setStoredDrawables] = useLocalStorage<drawableInfoBufferType>(
    LocalStorageKey.drawables,
    {}
  );

  const undo = () => {
    const prevIndex =
      layersNow > -1
        ? layersNow > layersHistory.length - 1
          ? layersHistory.length - 1
          : layersNow - 1
        : -1;
    const newDrawables = prevIndex > -1 ? layersHistory[prevIndex] : {};

    dispatch(setLayersNow(prevIndex));
    dispatch(setDrawables(newDrawables));

    setStoredDrawables(newDrawables);
  };

  const redo = () => {
    const nextIndex =
      layersNow < layersHistory.length - 1
        ? layersNow + 1
        : layersHistory.length - 1;
    const newDrawables = nextIndex > -1 ? layersHistory[nextIndex] : {};

    dispatch(setLayersNow(nextIndex));
    dispatch(setDrawables(nextIndex > -1 ? layersHistory[nextIndex] : {}));
    setStoredDrawables(newDrawables);
  };

  return { undo, redo };
};

export default useUndoRedo;
