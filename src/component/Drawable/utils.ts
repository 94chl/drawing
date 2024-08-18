import { KonvaEventObject } from "konva/lib/Node";

export const setCursorStyle = (
  target: KonvaEventObject<MouseEvent>,
  cursor: string
) => {
  const node = target.currentTarget;
  const stage = node.getStage();
  if (stage) {
    const container = stage.container();
    container.style.cursor = cursor;
  }
};
