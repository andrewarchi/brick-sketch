import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import editorReducer from './editor/editorReducer';

const middleware = applyMiddleware(logger);
const store = createStore(editorReducer, middleware);

export default store;
