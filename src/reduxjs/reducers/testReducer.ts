/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import { paginationTestsReceiveType, testReceiveType } from '@/src/types/receiveTypes';
import {
  createAnswerActionType,
  createQuestionActionType,
  createTestActionType,
  deleteAnswerActionType,
  deleteQuestionActionType,
  deleteTestActionType,
  editAnswerActionType,
  editQuestionActionType,
  getPaginationTestActionType,
  getTestActionType,
  moveAnswerActionType,
  setTestActionType,
  setPaginationTestActionType,
  editTestActionType,
  addQuestionActionType,
  addCurrentQuestionActionType,
} from '@/src/types/reducerActionTypes';
import createActionTypes from '@/src/utils/createActionTypes';
import { questionDataType } from '@/src/types/reducerInitialTypes';

interface TestSliceInterface {
  currentTest: testReceiveType | undefined;
  tests: testReceiveType[];
  questions: questionDataType[];
  currentQuestion: questionDataType | undefined;
  testMeta: paginationTestsReceiveType['meta'];
  loadingState: boolean;
  errors: string[];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {
    tests: [],
    currentTest: undefined,
    questions: [],
    currentQuestion: undefined,
    testMeta: { total_count: -1, total_pages: -1 },
    loadingState: false,
    errors: [],
  } as TestSliceInterface,
  reducers: {
    createTest: (state, action: createTestActionType) => {},

    editTest: (state, action: editTestActionType) => {},

    deleteTest: (state, action: deleteTestActionType) => {},

    getTest: (state, action: getTestActionType) => {},

    setTest: (state, action: setTestActionType) => {
      state.currentTest = action.payload;
    },

    getPaginationTests: (state, action: getPaginationTestActionType) => {},

    setPaginationTests: (state, action: setPaginationTestActionType) => {
      const isPageFirst = action.payload.page === 1;
      state.testMeta = action.payload.meta;

      if (isPageFirst) {
        state.tests = action.payload.tests;
      } else {
        state.tests = [...state.tests, ...action.payload.tests];
      }
    },

    setCurrentQuestion: (state, question: addCurrentQuestionActionType) => {
      state.currentQuestion = question.payload;
    },

    addLocalQuestion: (state, question: addQuestionActionType) => {
      state.questions =
        state.questions.length > 0
          ? [...state.questions, question.payload]
          : [question.payload];
    },

    deleteLocalQuestion: (state, question: deleteQuestionActionType) => {
      state.questions.filter((elem) => elem.id !== question.payload.id);
    },

    createQuestion: (state, action: createQuestionActionType) => {},

    editQuestion: (state, action: editQuestionActionType) => {},

    deleteQuestion: (state, action: deleteQuestionActionType) => {},

    createAnswer: (state, action: createAnswerActionType) => {},

    editAnswer: (state, action: editAnswerActionType) => {},

    moveAnswer: (state, action: moveAnswerActionType) => {},

    deleteAnswer: (state, action: deleteAnswerActionType) => {},
  },
});

export const testActionTypes = createActionTypes({
  actions: testSlice.actions,
  actionKeys: Object.keys(testSlice),
});

export const {
  createTest,
  editTest,
  deleteTest,
  getTest,
  setTest,
  getPaginationTests,
  setPaginationTests,
  createQuestion,
  setCurrentQuestion,
  addLocalQuestion,
  deleteLocalQuestion,
  editQuestion,
  deleteQuestion,
  createAnswer,
  editAnswer,
  moveAnswer,
  deleteAnswer,
} = testSlice.actions;
export default testSlice.reducer;
