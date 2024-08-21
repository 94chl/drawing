import { RootState } from "@/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setDrawables, setLayersNow } from "@/store/canvas";

const useUndoRedo = () => {
  const dispatch = useDispatch();
  const { layersNow, layersHistory } = useSelector(
    (store: RootState) => store.canvas,
    shallowEqual
  );

  const undo = () => {
    const prevIndex =
      layersNow > -1
        ? layersNow > layersHistory.length - 1
          ? layersHistory.length - 1
          : layersNow - 1
        : -1;

    dispatch(setLayersNow(prevIndex));
    dispatch(setDrawables(prevIndex > -1 ? layersHistory[prevIndex] : {}));
  };

  const redo = () => {
    const nextIndex =
      layersNow < layersHistory.length - 1
        ? layersNow + 1
        : layersHistory.length - 1;

    dispatch(setLayersNow(nextIndex));
    dispatch(setDrawables(nextIndex > -1 ? layersHistory[nextIndex] : {}));
  };

  return { undo, redo };
};

export default useUndoRedo;
