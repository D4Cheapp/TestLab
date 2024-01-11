import { all, put, takeEvery } from 'redux-saga/effects';
import { reducersActions } from '@/src/reduxjs/store/store';
import {
  profileLoginActionType,
  profileRegisterActionType,
} from '@/src/types/reducerActionTypes';
import { sagaHandling } from '@/src/utils/sagaHandling';
import {
  profileAuthReceiveType,
  profileLogoutReceiveType,
} from '@/src/types/receiveTypes';
import {
  deleteCurrentProfile,
  setCurrentProfile,
} from '@/src/reduxjs/reducers/authReducer';

function* profileRegisterSaga(action: profileRegisterActionType) {
  yield sagaHandling<profileAuthReceiveType>({
    method: 'POST',
    href: '/signup',
    body: action.payload,
    isDataInAction: true,
    action: (data?: profileAuthReceiveType) => put(setCurrentProfile(data)),
  });
}

function* profileLoginSaga(action: profileLoginActionType) {
  yield sagaHandling<profileAuthReceiveType>({
    method: 'POST',
    href: '/signin',
    body: action.payload,
    isDataInAction: true,
    action: (data?: profileAuthReceiveType) => put(setCurrentProfile(data)),
  });
}

function* getCurrentProfileSaga() {
  yield sagaHandling<profileAuthReceiveType>({
    method: 'GET',
    href: '/users/current',
    isDataInAction: true,
    action: (data?: profileAuthReceiveType) =>
      put(setCurrentProfile(!data || 'error' in data ? null : data)),
  });
}

function* profileLogoutSaga() {
  yield sagaHandling<profileLogoutReceiveType>({
    method: 'DELETE',
    href: '/logout',
    isDataInAction: true,
    action: (data?: profileLogoutReceiveType) =>
      data !== undefined ? put(deleteCurrentProfile(data)) : {},
  });
}

export default function* authSaga() {
  yield all([
    takeEvery(reducersActions.getCurrentProfile, getCurrentProfileSaga),
    takeEvery(reducersActions.profileRegister, profileRegisterSaga),
    takeEvery(reducersActions.profileLogin, profileLoginSaga),
    takeEvery(reducersActions.profileLogout, profileLogoutSaga),
  ]);
}
