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
import { profileLoginActionType, profileRegisterActionType } from '@/src/types/reducerActionTypes';
import { sagaErrorHandling } from '@/src/utils/sagaErrorHandling';
import {
  actionTypes,
  deleteCurrentProfile,
  setCurrentProfile,
  setLoadingState,
} from '@/src/reduxjs/reducers/testReducer';
import { profileAuthReceiveType, profileLogoutReceiveType } from '@/src/types/receiveTypes';
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

function* profileRegisterSaga(
  action: profileRegisterActionType,
): sagaGeneratorType<profileAuthReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [profileAuthReceiveType, Response] = yield call(() =>
    createFetch<profileAuthReceiveType>({
      method: 'POST',
      href: '/signup',
      body: action.payload,
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => put(setCurrentProfile(data)));
}

function* profileLoginSaga(
  action: profileLoginActionType,
): sagaGeneratorType<profileAuthReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [profileAuthReceiveType, Response] = yield call(() =>
    createFetch<profileAuthReceiveType>({
      method: 'POST',
      href: '/signin',
      body: action.payload,
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => put(setCurrentProfile(data)));
}

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

function* profileLogoutSaga(): sagaGeneratorType<profileLogoutReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [profileLogoutReceiveType, Response] = yield call(() =>
    createFetch<profileLogoutReceiveType>({
      method: 'DELETE',
      href: '/logout',
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => put(deleteCurrentProfile(data)));
}

export default function* testSaga() {
  yield all([
    takeEvery(actionTypes.getCurrentProfile, getCurrentProfileSaga),
    takeEvery(actionTypes.profileRegister, profileRegisterSaga),
    takeEvery(actionTypes.profileLogin, profileLoginSaga),
    takeEvery(actionTypes.profileLogout, profileLogoutSaga),
  ]);
}
