import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { adminReducer } from '../features/adminReducer';

const rootReducer = combineReducers({
    admin: adminReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));


