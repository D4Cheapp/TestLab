import {
  all,
  call,
  CallEffectDescriptor,
  put,
  PutEffectDescriptor,
  SimpleEffect,
  takeEvery,
} from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  actionTypes,
  deleteCurrentProfile,
  setCurrentProfile,
  setLoadingState,
  setPaginationTests,
  setTest,
} from '@/src/reduxjs/reducers/testReducer';
import {
  createAnswerReciveType,
  createQuestionRecieveType,
  deleteRecieveType,
  moveAnswerRecieveType,
  paginationTestsReceiveType,
  profileAuthReceiveType,
  profileLogoutReceiveType,
  testReceiveType,
} from '@/src/types/receiveTypes';
import {
  createAnswerActionType,
  createQuestionActionType,
  createTestActionType,
  deleteTestActionType,
  editAnswerActionType,
  editQuestionActionType,
  getPaginationTestActionType,
  getTestActionType,
  profileLoginActionType,
  profileRegisterActionType,
  editTestActionType,
  moveAnswerActionType,
  deleteAnswerActionType,
} from '@/src/types/reducerActionTypes';
import { createFetch } from '@/src/utils/createFetch';
import { sagaErrorHandling } from '@/src/utils/sagaErrorHandling';

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

function* createTestSaga(action: createTestActionType): sagaGeneratorType<testReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [testReceiveType, Response] = yield call(() =>
    createFetch<testReceiveType>({
      method: 'POST',
      href: `/tests`,
      body: { title: action.payload.title },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* editTestSaga(action: editTestActionType): sagaGeneratorType<testReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [testReceiveType, Response] = yield call(() =>
    createFetch<testReceiveType>({
      method: 'PATCH',
      href: `/tests/${action.payload.id}`,
      body: { title: action.payload.title },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* deleteTestSaga(action: deleteTestActionType): sagaGeneratorType<deleteRecieveType> {
  yield put(setLoadingState(true));
  const [data, response]: [deleteRecieveType, Response] = yield call(() =>
    createFetch<deleteRecieveType>({
      method: 'DELETE',
      href: `/tests/${action.payload.id}`,
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* getTestSaga(action: getTestActionType): sagaGeneratorType<testReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [testReceiveType, Response] = yield call(() =>
    createFetch<testReceiveType>({
      method: 'GET',
      href: `/tests/${action.payload.id}/`,
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => setTest(data));
}

function* getPaginationTestsSaga(
  action: getPaginationTestActionType,
): sagaGeneratorType<paginationTestsReceiveType> {
  yield put(setLoadingState(true));
  const [data, response]: [paginationTestsReceiveType, Response] = yield call(() =>
    createFetch<paginationTestsReceiveType>({
      method: 'GET',
      href: '/tests',
      body: action.payload,
    }),
  );
  yield sagaErrorHandling(response.ok, data, () => put(setPaginationTests(data)));
}

function* createQuestionSaga(
  action: createQuestionActionType,
): sagaGeneratorType<createQuestionRecieveType> {
  yield put(setLoadingState(true));
  const { title, question_type, answer } = action.payload;
  const [data, response]: [createQuestionRecieveType, Response] = yield call(() =>
    createFetch<createQuestionRecieveType>({
      method: 'POST',
      href: `/tests/${action.payload.test_id}/questions`,
      body: { title, question_type, answer },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* editQuestionSaga(
  action: editQuestionActionType,
): sagaGeneratorType<createQuestionRecieveType> {
  yield put(setLoadingState(true));
  const { title, question_type, answer } = action.payload;
  const [data, response]: [createQuestionRecieveType, Response] = yield call(() =>
    createFetch<createQuestionRecieveType>({
      method: 'PATCH',
      href: `/question/${action.payload.id}`,
      body: { title, question_type, answer },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* deleteQuestoinSaga(action: deleteTestActionType): sagaGeneratorType<deleteRecieveType> {
  yield put(setLoadingState(true));
  const [data, response]: [deleteRecieveType, Response] = yield call(() =>
    createFetch<deleteRecieveType>({
      method: 'DELETE',
      href: `/question/${action.payload.id}`,
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* createAnswerSaga(
  action: createAnswerActionType,
): sagaGeneratorType<createAnswerReciveType> {
  yield put(setLoadingState(true));
  const { text, is_right } = action.payload;
  const [data, response]: [createAnswerReciveType, Response] = yield call(() =>
    createFetch<createAnswerReciveType>({
      method: 'POST',
      href: `/questions/${action.payload.question_id}/answers`,
      body: { text, is_right },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* editAnswerSaga(action: editAnswerActionType): sagaGeneratorType<createAnswerReciveType> {
  yield put(setLoadingState(true));
  const { text, is_right } = action.payload;
  const [data, response]: [createAnswerReciveType, Response] = yield call(() =>
    createFetch<createAnswerReciveType>({
      method: 'PATCH',
      href: `/answers/${action.payload.id}`,
      body: { text, is_right },
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* moveAnswerSaga(action: moveAnswerActionType): sagaGeneratorType<moveAnswerRecieveType> {
  yield put(setLoadingState(true));
  const [data, response]: [moveAnswerRecieveType, Response] = yield call(() =>
    createFetch<moveAnswerRecieveType>({
      method: 'PATCH',
      href: `/answers/${action.payload.id}/insert_at/:position`,
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

function* deleteAnswerSaga(action: deleteAnswerActionType): sagaGeneratorType<deleteRecieveType> {
  yield put(setLoadingState(true));
  const [data, response]: [deleteRecieveType, Response] = yield call(() =>
    createFetch<deleteRecieveType>({
      method: 'DELETE',
      href: `/answers/${action.payload.id}`,
    }),
  );
  yield sagaErrorHandling(response.ok, data);
}

export default function* testSaga() {
  yield all([
    takeEvery(actionTypes.getCurrentProfile, getCurrentProfileSaga),
    takeEvery(actionTypes.profileRegister, profileRegisterSaga),
    takeEvery(actionTypes.profileLogin, profileLoginSaga),
    takeEvery(actionTypes.profileLogout, profileLogoutSaga),
    takeEvery(actionTypes.createTest, createTestSaga),
    takeEvery(actionTypes.editTest, editTestSaga),
    takeEvery(actionTypes.deleteTest, deleteTestSaga),
    takeEvery(actionTypes.getTest, getTestSaga),
    takeEvery(actionTypes.getPaginationTests, getPaginationTestsSaga),
    takeEvery(actionTypes.createQuestion, createQuestionSaga),
    takeEvery(actionTypes.editQuestion, editQuestionSaga),
    takeEvery(actionTypes.deleteQuestoin, deleteQuestoinSaga),
    takeEvery(actionTypes.createAnswer, createAnswerSaga),
    takeEvery(actionTypes.editAnswer, editAnswerSaga),
    takeEvery(actionTypes.moveAnswer, moveAnswerSaga),
    takeEvery(actionTypes.deleteAnswer, deleteAnswerSaga),
  ]);
}
