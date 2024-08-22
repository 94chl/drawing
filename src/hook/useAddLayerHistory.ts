import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setLayersHitory, setLayersNow } from "@/store/canvas";

import useLocalStorage from "./useLocalStorage";
import type { drawableInfoBufferType } from "@/utils/type";
import { LocalStorageKey } from "@/utils/const";

const useAddLayerHistory = () => {
  const dispatch = useDispatch();
  const { layersNow, layersHistoryLimit, layersHistory } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const [, setStoredDrawables] = useLocalStorage<drawableInfoBufferType>(
    LocalStorageKey.drawables,
    {}
  );

  const addLayerHistory = (newDrawables: drawableInfoBufferType) => {
    const newLayersHistory =
      layersNow < layersHistoryLimit - 1
        ? layersHistory.filter((_, index) => index <= layersNow)
        : layersHistory.filter(
            (_, index) =>
              layersHistory.length - layersHistoryLimit + 1 <= index &&
              index < layersHistoryLimit
          );
    newLayersHistory.push(newDrawables);

    const nextIndex =
      layersNow + 1 < layersHistoryLimit - 1
        ? layersNow + 1
        : layersHistoryLimit - 1;

    dispatch(setLayersHitory(newLayersHistory));
    dispatch(setLayersNow(nextIndex));
    setStoredDrawables(newDrawables);
  };

  return addLayerHistory;
};

export default useAddLayerHistory;
