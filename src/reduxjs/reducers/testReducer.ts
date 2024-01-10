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
  addLocalQuestionActionType,
  addCurrentQuestionActionType,
  editLocalQuestionAction,
} from '@/src/types/reducerActionTypes';
import createActionTypes from '@/src/utils/createActionTypes';
import { currentTestType } from '@/src/types/reducerInitialTypes';
import { createQuestionRequestType } from '@/src/types/requestTypes';

interface TestSliceInterface {
  testList: testReceiveType[];
  currentTest?: currentTestType;
  currentQuestion?: createQuestionRequestType;
  testMeta: paginationTestsReceiveType['meta'];
  loadingState: boolean;
  errors: string[];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {
    testList: [],
    currentTest: undefined,
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
      const receivedTest = action.payload;
      const receivedQuestionsToCurrent = receivedTest?.questions.map((question) => {
        const { title, question_type, answer, answers, id } = question;
        return {
          id,
          title,
          question_type,
          answer,
          answers: answers.map((answer, index) => {
            return {
              id: answer.id,
              text: answer.text,
              is_right: answer.is_right,
              position: index,
            };
          }),
        };
      });

      state.currentTest = {
        id: action.payload?.id,
        title: receivedTest?.title,
        questions: receivedQuestionsToCurrent,
      };
    },

    getPaginationTests: (state, action: getPaginationTestActionType) => {},

    setPaginationTests: (state, action: setPaginationTestActionType) => {
      const isPageFirst = action.payload.page === 1;
      state.testMeta = action.payload.meta;

      if (isPageFirst) {
        state.testList = action.payload.tests;
      } else {
        state.testList = [...state.testList, ...action.payload.tests];
      }
    },

    setCurrentQuestion: (state, question: addCurrentQuestionActionType) => {
      state.currentQuestion = question.payload;
    },

    addLocalQuestion: (state, question: addLocalQuestionActionType) => {
      const questions = state.currentTest?.questions;
      if (!state.currentTest) {
        state.currentTest = {};
      }

      state.currentTest.questions =
        //@ts-ignore
        questions?.length > 0 ? [...questions, question.payload] : [question.payload];
    },

    editLocalQuestion: (state, question: editLocalQuestionAction) => {
      const questions = state.currentTest?.questions;

      //@ts-ignore
      state.currentTest.questions = questions?.map((q) => {
        const isTargetQuestion = q.id === question.payload.id;
        return isTargetQuestion ? question.payload : q;
      });
    },

    deleteLocalQuestion: (state, question: deleteQuestionActionType) => {
      const currentQuestions = state.currentTest?.questions;
      if (currentQuestions) {
        //@ts-ignore
        state.currentTest.questions = currentQuestions.filter(
          (elem) => elem.id !== question.payload.id,
        );
      }
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
  editLocalQuestion,
  deleteLocalQuestion,
  editQuestion,
  deleteQuestion,
  createAnswer,
  editAnswer,
  moveAnswer,
  deleteAnswer,
} = testSlice.actions;
export default testSlice.reducer;
