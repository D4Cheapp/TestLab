import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { saga } from '@/src/reduxjs/saga';
import { testReducer } from '@/src/reduxjs/reducers';

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ test: testReducer });

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(saga);
export default store;
