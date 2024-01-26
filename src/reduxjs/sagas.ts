import { all } from 'redux-saga/effects';
import testSaga from './test/sagas';
import authSaga from './auth/sagas';

export function* rootSaga() {
  yield all([testSaga(), authSaga()]);
}
