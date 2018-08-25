export const SET_PICTURE = 'SET_PICTURE';
export const SET_COLOR = 'SET_COLOR';
export const SET_TOOL = 'SET_TOOL';
export const UNDO = 'UNDO';

export function setPicture(picture) {
  return { type: SET_PICTURE, meta: { picture } };
}

export function setColor(color) {
  return { type: SET_COLOR, meta: { color } };
}

export function setTool(tool) {
  return { type: SET_TOOL, meta: { tool } };
}

export function undo() {
  return { type: UNDO };
}
