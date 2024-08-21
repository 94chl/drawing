export enum ToolEnum {
  select = "SELECT",
  rect = "RECT",
  ellipse = "ELLIPSE",
  polygon = "POLYGON",
}

export const STANDARD_DRAWABLES = [ToolEnum.ellipse, ToolEnum.rect];

export enum LocalStorageKey {
  drawables = "STORED_DRAWABLES",
}

export enum KeyboardKeyEnum {
  escape = "escape",
  backspace = "backspace",
  delete = "delete",
  z = "z",
  r = "r",
  e = "e",
  c = "c",
  p = "p",
  ctrl = "ctrl",
}
