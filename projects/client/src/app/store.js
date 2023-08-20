import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { adminReducer } from '../features/adminReducer';
import { warehouseReducer } from '../features/warehouseReducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    warehouse:warehouseReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));


