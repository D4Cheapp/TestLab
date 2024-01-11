import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  getTest,
  setPaginationTests,
  setCurrentTest,
} from '@/src/reduxjs/reducers/testReducer';
import {
  createAnswerReceiveType,
  createQuestionReceiveType,
  deleteReceiveType,
  moveAnswerReceiveType,
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
  deleteQuestionActionType,
} from '@/src/types/reducerActionTypes';
import { sagaHandling } from '@/src/utils/sagaHandling';
import { reducersActions } from '@/src/reduxjs/store/store';

function* createTestSaga(action: createTestActionType) {
  const { title, questions } = action.payload;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: testReceiveType | { error: boolean } = yield sagaHandling<testReceiveType>({
    method: 'POST',
    href: `/tests`,
    body: { title },
  });

  const isCorrectData = questions && !('error' in data) && data?.id;
  if (isCorrectData) {
    for (const question of questions) {
      const { title, question_type } = question;
      const questionData = { title, question_type, test_id: data.id };

      if (question.answer) {
        //@ts-ignore
        questionData.answer = question.answer;
      }

      if (question.answers) {
        //@ts-ignore
        questionData.answers = question.answers;
      }

      yield call(() =>
        createQuestionSaga({
          payload: questionData,
          type: 'testSlice/createQuestion',
        }),
      );
    }
  }
}

function* editTestSaga(action: editTestActionType) {
  const { id, title } = action.payload;
  yield sagaHandling<testReceiveType>({
    method: 'PATCH',
    href: `/tests/${id}`,
    body: { title: title },
  });
}

function* deleteTestSaga(action: deleteTestActionType) {
  yield sagaHandling<deleteReceiveType>({
    method: 'DELETE',
    href: `/tests/${action.payload.id}`,
  });
}

function* getTestSaga(action: getTestActionType) {
  yield sagaHandling<testReceiveType>({
    method: 'GET',
    href: `/tests/${action.payload.id}/`,
    isDataInAction: true,
    action: (data?: testReceiveType) =>
      data !== undefined ? put(setCurrentTest(data)) : {},
  });
}

function* getPaginationTestsSaga(action: getPaginationTestActionType) {
  yield sagaHandling<paginationTestsReceiveType>({
    method: 'GET',
    href: '/tests',
    body: action.payload,
    isDataInAction: true,
    action: (data?: paginationTestsReceiveType) =>
      data !== undefined ? put(setPaginationTests({ ...data, ...action.payload })) : {},
  });
}

function* createQuestionSaga(action: createQuestionActionType) {
  const { title, test_id, question_type, answer, answers } = action.payload;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: createQuestionReceiveType | { error: boolean } =
    yield sagaHandling<createQuestionReceiveType>({
      method: 'POST',
      href: `/tests/${action.payload.test_id}/questions`,
      body: { title, question_type, answer },
    });

  const isCorrectData = answers && !('error' in data) && data?.id;
  if (isCorrectData) {
    for (const ans of answers) {
      yield call(() =>
        createAnswerSaga({
          payload: {
            question_id: data.id,
            text: ans.text,
            is_right: ans.is_right,
          },
          type: 'testSlice/createAnswer',
        }),
      );
    }
  }

  yield test_id ? put(getTest({ id: test_id })) : undefined;
}

function* editQuestionSaga(action: editQuestionActionType) {
  const { title, test_id, question_type, answer, answers } = action.payload;
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: createQuestionReceiveType | { error: boolean } =
    yield sagaHandling<createQuestionReceiveType>({
      method: 'PATCH',
      href: `/questions/${action.payload.id}`,
      body: { title, question_type, answer },
    });

  const isCorrectData = answers && !('error' in data) && data?.id;
  if (isCorrectData) {
    for (const ans of answers) {
      const isReadyToMove = ans.isLocalPosition && ans.position;
      const isLocallyChanged = ans.isLocalInfo;
      const isCreated = ans.isCreated;
      const isDeleted = ans.isDeleted;

      if (isDeleted) {
        yield call(() =>
          deleteAnswerSaga({
            payload: { id: ans.id },
            type: 'testSlice/createAnswer',
          }),
        );
      }

      if (isCreated) {
        yield call(() =>
          createAnswerSaga({
            payload: {
              question_id: data.id,
              text: ans.text,
              is_right: ans.is_right,
            },
            type: 'testSlice/createAnswer',
          }),
        );
      }

      if (isReadyToMove) {
        yield call(() =>
          moveAnswerSaga({
            payload: {
              id: ans.id,
              //@ts-ignore
              position: ans.position,
            },
            type: 'testSlice/createAnswer',
          }),
        );
      }

      if (isLocallyChanged) {
        yield call(() =>
          editAnswerSaga({
            payload: {
              id: ans.id,
              text: ans.text,
              is_right: ans.is_right,
            },
            type: 'testSlice/createAnswer',
          }),
        );
      }
    }
  }

  yield test_id ? put(getTest({ id: test_id })) : undefined;
}

function* deleteQuestionSaga(action: deleteQuestionActionType) {
  yield sagaHandling<deleteReceiveType>({
    method: 'DELETE',
    href: `/questions/${action.payload.id}/`,
    action: () =>
      action.payload.test_id ? put(getTest({ id: action.payload.test_id })) : undefined,
  });
}

function* createAnswerSaga(action: createAnswerActionType) {
  const { text, is_right } = action.payload;
  yield sagaHandling<createAnswerReceiveType>({
    method: 'POST',
    href: `/questions/${action.payload.question_id}/answers`,
    body: { text, is_right },
  });
}

function* editAnswerSaga(action: editAnswerActionType) {
  const { text, is_right } = action.payload;
  yield sagaHandling<createAnswerReceiveType>({
    method: 'PATCH',
    href: `/answers/${action.payload.id}`,
    body: { text, is_right },
  });
}

function* moveAnswerSaga(action: moveAnswerActionType) {
  const { id, position } = action.payload;
  yield sagaHandling<moveAnswerReceiveType>({
    method: 'PATCH',
    href: `/answers/${id}/insert_at/${position}`,
  });
}

function* deleteAnswerSaga(action: deleteAnswerActionType) {
  yield sagaHandling<deleteReceiveType>({
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
    takeEvery(reducersActions.deleteQuestion, deleteQuestionSaga),
    takeEvery(reducersActions.createAnswer, createAnswerSaga),
    takeEvery(reducersActions.editAnswer, editAnswerSaga),
    takeEvery(reducersActions.moveAnswer, moveAnswerSaga),
    takeEvery(reducersActions.deleteAnswer, deleteAnswerSaga),
  ]);
}
