import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { saga } from '@/src/reduxjs/saga';
import {
  authActionTypes,
  authReducer,
  baseActionTypes,
  baseReducer,
  testActionTypes,
  testReducer,
} from '@/src/reduxjs/reducers';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({ test: testReducer, base: baseReducer, auth: authReducer });
export const reducersActions = Object.assign(testActionTypes, baseActionTypes, authActionTypes);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(saga);
export default store;
