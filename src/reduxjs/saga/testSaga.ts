import {
  all,
  call,
  takeEvery,
  PutEffectDescriptor,
  SimpleEffect,
  CallEffectDescriptor,
  put,
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { sagaErrorHandling } from '@/src/utils/sagaErrorHandling';
import { actionTypes, setCurrentProfile, setLoadingState } from '@/src/reduxjs/reducers/testReducer';
import { profileAuthReceiveType } from '@/src/types/receiveTypes';
import { createFetch } from '@/src/utils/createFetch';

type sagaGeneratorType<T> = Generator<
  | SimpleEffect<'PUT', PutEffectDescriptor<PayloadAction<boolean, 'testSlice/setLoadingState'>>>
  | Generator<
      | SimpleEffect<
          'PUT',
          PutEffectDescriptor<PayloadAction<string | undefined, 'testSlice/setErrorsState'>>
        >
      | void
      | SimpleEffect<
          'PUT',
          PutEffectDescriptor<PayloadAction<boolean, 'testSlice/setLoadingState'>>
        >,
      void,
      unknown
    >
  | SimpleEffect<'CALL', CallEffectDescriptor<[object, Response] | Error>>,
  void,
  [T, Response]
>;

function* getCurrentProfileSaga(): sagaGeneratorType<profileAuthReceiveType> {
  yield put(setLoadingState(true));
  const [data, response] = yield call(() =>
    createFetch<profileAuthReceiveType>({
      method: 'GET',
      href: '/users/current',
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => put(setCurrentProfile(data)));
}

export default function* testSaga() {
  yield all([takeEvery(actionTypes.getCurrentProfile, getCurrentProfileSaga)]);
}
