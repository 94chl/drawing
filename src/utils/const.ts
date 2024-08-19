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
