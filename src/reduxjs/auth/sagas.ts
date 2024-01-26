import { all, put, takeEvery } from 'redux-saga/effects';
import { sagaHandling } from '@/src/utils/sagaHandling';
import {
  ProfileAuthReceiveType,
  ProfileLogoutReceiveType,
} from '@/src/types/receiveTypes';
import { deleteCurrentProfile, setCurrentProfile } from '@/src/reduxjs/auth';
import { ProfileLoginActionType, ProfileRegisterActionType } from './types';
import { reducersActions } from '..';

function* profileRegisterSaga(action: ProfileRegisterActionType) {
  yield sagaHandling<ProfileAuthReceiveType>({
    method: 'POST',
    href: '/signup',
    body: action.payload,
    isDataInAction: true,
    action: (data?: ProfileAuthReceiveType) => put(setCurrentProfile(data)),
  });
}

function* profileLoginSaga(action: ProfileLoginActionType) {
  yield sagaHandling<ProfileAuthReceiveType>({
    method: 'POST',
    href: '/signin',
    body: action.payload,
    isDataInAction: true,
    action: (data?: ProfileAuthReceiveType) => put(setCurrentProfile(data)),
  });
}

function* getCurrentProfileSaga() {
  yield sagaHandling<ProfileAuthReceiveType>({
    method: 'GET',
    href: '/users/current',
    isDataInAction: true,
    action: (data?: ProfileAuthReceiveType) =>
      put(setCurrentProfile(!data || 'error' in data ? null : data)),
  });
}

function* profileLogoutSaga() {
  yield sagaHandling<ProfileLogoutReceiveType>({
    method: 'DELETE',
    href: '/logout',
    isDataInAction: true,
    action: (data?: ProfileLogoutReceiveType) =>
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
