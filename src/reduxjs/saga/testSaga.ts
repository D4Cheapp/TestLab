import { all, takeEvery } from 'redux-saga/effects';
import { setPaginationTests, setTest } from '@/src/reduxjs/reducers/testReducer';
import {
  createAnswerReciveType,
  createQuestionRecieveType,
  deleteRecieveType,
  moveAnswerRecieveType,
  paginationTestsReceiveType,
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
  editTestActionType,
  moveAnswerActionType,
  deleteAnswerActionType,
} from '@/src/types/reducerActionTypes';
import { sagaHandling } from '@/src/utils/sagaHandling';
import { reducersActions } from '@/src/reduxjs/store/store';

function* createTestSaga(action: createTestActionType) {
  yield sagaHandling<testReceiveType>({
    method: 'POST',
    href: `/tests`,
    body: { title: action.payload.title },
  });
}

function* editTestSaga(action: editTestActionType) {
  yield sagaHandling<testReceiveType>({
    method: 'PATCH',
    href: `/tests/${action.payload.id}`,
    body: { title: action.payload.title },
  });
}

function* deleteTestSaga(action: deleteTestActionType) {
  yield sagaHandling<deleteRecieveType>({
    method: 'DELETE',
    href: `/tests/${action.payload.id}`,
  });
}

function* getTestSaga(action: getTestActionType) {
  yield sagaHandling<testReceiveType>({
    method: 'GET',
    href: `/tests/${action.payload.id}/`,
    isDataInAction: true,
    action: (data: testReceiveType | undefined) => (data !== undefined ? setTest(data) : {}),
  });
}

function* getPaginationTestsSaga(action: getPaginationTestActionType) {
  yield sagaHandling<paginationTestsReceiveType>({
    method: 'GET',
    href: '/tests',
    body: action.payload,
    isDataInAction: true,
    action: (data: paginationTestsReceiveType | undefined) =>
      data !== undefined ? setPaginationTests(data) : {},
  });
}

function* createQuestionSaga(action: createQuestionActionType) {
  const { title, question_type, answer } = action.payload;
  yield sagaHandling<createQuestionRecieveType>({
    method: 'POST',
    href: `/tests/${action.payload.test_id}/questions`,
    body: { title, question_type, answer },
  });
}

function* editQuestionSaga(action: editQuestionActionType) {
  const { title, question_type, answer } = action.payload;
  yield sagaHandling<createQuestionRecieveType>({
    method: 'PATCH',
    href: `/question/${action.payload.id}`,
    body: { title, question_type, answer },
  });
}

function* deleteQuestoinSaga(action: deleteTestActionType) {
  yield sagaHandling<deleteRecieveType>({
    method: 'DELETE',
    href: `/question/${action.payload.id}`,
  });
}

function* createAnswerSaga(action: createAnswerActionType) {
  const { text, is_right } = action.payload;
  yield sagaHandling<createAnswerReciveType>({
    method: 'POST',
    href: `/questions/${action.payload.question_id}/answers`,
    body: { text, is_right },
  });
}

function* editAnswerSaga(action: editAnswerActionType) {
  const { text, is_right } = action.payload;
  yield sagaHandling<createAnswerReciveType>({
    method: 'PATCH',
    href: `/answers/${action.payload.id}`,
    body: { text, is_right },
  });
}

function* moveAnswerSaga(action: moveAnswerActionType) {
  yield sagaHandling<moveAnswerRecieveType>({
    method: 'PATCH',
    href: `/answers/${action.payload.id}/insert_at/:position`,
  });
}

function* deleteAnswerSaga(action: deleteAnswerActionType) {
  yield sagaHandling<deleteRecieveType>({
    method: 'DELETE',
    href: `/answers/${action.payload.id}`,
  });
}

export default function* testSaga() {
  yield all([
    takeEvery(reducersActions.createTest, createTestSaga),
    takeEvery(reducersActions.editTest, editTestSaga),
    takeEvery(reducersActions.deleteTest, deleteTestSaga),
    takeEvery(reducersActions.getTest, getTestSaga),
    takeEvery(reducersActions.getPaginationTests, getPaginationTestsSaga),
    takeEvery(reducersActions.createQuestion, createQuestionSaga),
    takeEvery(reducersActions.editQuestion, editQuestionSaga),
    takeEvery(reducersActions.deleteQuestion, deleteQuestoinSaga),
    takeEvery(reducersActions.createAnswer, createAnswerSaga),
    takeEvery(reducersActions.editAnswer, editAnswerSaga),
    takeEvery(reducersActions.moveAnswer, moveAnswerSaga),
    takeEvery(reducersActions.deleteAnswer, deleteAnswerSaga),
  ]);
}
