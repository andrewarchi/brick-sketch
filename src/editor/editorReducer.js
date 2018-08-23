import Picture from './Picture';

const initialState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0
};

export default function(state = initialState, action) {
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
