import * as e from './editorActions';
import Picture from './Picture';

const initialState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case e.SET_PICTURE:
      if (state.doneAt < Date.now() - 1000) {
        return {
          ...state,
          picture: action.meta.picture,
          done: [state.picture, ...state.done],
          doneAt: Date.now()
        };
      }
      else {
        return { ...state, picture: action.meta.picture };
      }
    case e.SET_COLOR:
      return { ...state, color: action.meta.color };
    case e.SET_TOOL:
      return { ...state, tool: action.meta.tool };
    case e.UNDO:
      if (state.done.length === 0) return state;
      return {
        ...state,
        picture: state.done[0],
        done: state.done.slice(1),
        doneAt: 0
      };
    default:
      return state;
  }
}
