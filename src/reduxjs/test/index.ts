/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import { PaginationTestsReceiveType, TestReceiveType } from '@/src/types/receiveTypes';
import {
  CreateAnswerActionType,
  CreateQuestionActionType,
  CreateTestActionType,
  DeleteAnswerActionType,
  DeleteQuestionActionType,
  DeleteTestActionType,
  EditAnswerActionType,
  EditQuestionActionType,
  GetPaginationTestActionType,
  GetTestActionType,
  MoveAnswerActionType,
  SetCurrentTestActionType,
  SetPaginationTestActionType,
  EditTestActionType,
  AddLocalQuestionActionType,
  EditLocalQuestionAction,
  CurrentTestType,
} from './types';

interface TestSliceInterface {
  testList: TestReceiveType[];
  currentTest?: CurrentTestType;
  testMeta: PaginationTestsReceiveType['meta'];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {
    testList: [],
    currentTest: undefined,
    testMeta: { total_count: -1, total_pages: -1 },
  } as TestSliceInterface,
  reducers: {
    createTest: (state, action: CreateTestActionType) => state,

    editTest: (state, action: EditTestActionType) => state,

    deleteTest: (state, action: DeleteTestActionType) => state,

    getTest: (state, action: GetTestActionType) => state,

    setCurrentTest: (state, action: SetCurrentTestActionType) => {
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

    getPaginationTests: (state, action: GetPaginationTestActionType) => state,

    setPaginationTests: (state, action: SetPaginationTestActionType) => {
      const isPageFirst = action.payload.page === 1;
      state.testMeta = action.payload.meta;

      if (isPageFirst) {
        state.testList = action.payload.tests;
      } else {
        state.testList = [...state.testList, ...action.payload.tests];
      }
    },

    addLocalQuestion: (state, question: AddLocalQuestionActionType) => {
      const questions = state.currentTest?.questions;
      if (!state.currentTest) {
        state.currentTest = {};
      }

      state.currentTest.questions =
        //@ts-ignore
        questions?.length > 0 ? [...questions, question.payload] : [question.payload];
    },

    editLocalQuestion: (state, question: EditLocalQuestionAction) => {
      const questions = state.currentTest?.questions;

      //@ts-ignore
      state.currentTest.questions = questions?.map((q) => {
        const isTargetQuestion = q.id === question.payload.id;
        return isTargetQuestion ? question.payload : q;
      });
    },

    deleteLocalQuestion: (state, question: DeleteQuestionActionType) => {
      const currentQuestions = state.currentTest?.questions;
      if (currentQuestions) {
        //@ts-ignore
        state.currentTest.questions = currentQuestions.filter(
          (elem) => elem.id !== question.payload.id,
        );
      }
    },

    createQuestion: (state, action: CreateQuestionActionType) => state,

    editQuestion: (state, action: EditQuestionActionType) => state,

    deleteQuestion: (state, action: DeleteQuestionActionType) => state,

    createAnswer: (state, action: CreateAnswerActionType) => state,

    editAnswer: (state, action: EditAnswerActionType) => state,

    moveAnswer: (state, action: MoveAnswerActionType) => state,

    deleteAnswer: (state, action: DeleteAnswerActionType) => state,
  },
});

export const testActions = testSlice.actions;
export const {
  createTest,
  editTest,
  deleteTest,
  getTest,
  setCurrentTest,
  getPaginationTests,
  setPaginationTests,
  createQuestion,
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
