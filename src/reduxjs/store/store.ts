import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { saga } from '@/src/reduxjs/saga';
import { testReducer } from '@/src/reduxjs/reducers';

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ testReducer });

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(saga);
export default store;
