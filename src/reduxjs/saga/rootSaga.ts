import { all } from 'redux-saga/effects';
import testSaga from '@/src/reduxjs/saga/testSaga';
import authSaga from '@/src/reduxjs/saga/authSaga';

export default function* rootSaga() {
  yield all([testSaga(), authSaga()]);
}
