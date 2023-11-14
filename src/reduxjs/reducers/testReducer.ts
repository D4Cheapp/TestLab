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
  setPaginationTestActionType,
  setTestActionType,
  editTestActionType,
} from '@/src/types/reducerActionTypes';
import createActionTypes from '@/src/utils/createActionTypes';

interface TestSliceInterface {
  currentTest: testReceiveType | undefined;
  tests: testReceiveType[];
  testsMeta: paginationTestsReceiveType['meta'];
  loadingState: boolean;
  errors: string[];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {
    currentTest: undefined,
    tests: [],
    testsMeta: { total_count: 7, total_pages: 0 },
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
      state.testsMeta = action.payload.meta;
      state.tests = action.payload.tests;
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
  editQuestion,
  deleteQuestion,
  createAnswer,
  editAnswer,
  moveAnswer,
  deleteAnswer,
} = testSlice.actions;
export default testSlice.reducer;
