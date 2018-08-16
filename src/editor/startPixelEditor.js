// https://eloquentjavascript.net/19_paint.html

import React from 'react';
import Picture from './Picture';
import PixelEditor from './PixelEditor';
import { draw, fill, rectangle, pick } from './tools';
import { ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton } from './controls';

const startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0
};

const baseTools = { draw, fill, rectangle, pick };

const baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function historyUpdateState(state, action) {
  if (action.undo === true) {
    if (state.done.length === 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    };
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    };
  } else {
    return { ...state, ...action };
  }
}

export default function startPixelEditor({ state = startState, tools = baseTools, controls = baseControls } = {}) {
  const dispatch = action => state = historyUpdateState(state, action);
  return <PixelEditor tools={tools} controls={controls} dispatch={dispatch} />;
}
