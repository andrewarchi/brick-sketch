import { createStore } from 'redux';
import editorReducer from './editor/editorReducer';

const store = createStore(editorReducer);

export default store;
