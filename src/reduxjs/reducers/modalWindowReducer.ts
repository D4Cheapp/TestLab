/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import {
  setModalWindowActionType,
  deleteQuestionActionType,
  addQuestionActionType,
  addCurrentQuestionActionType,
} from '@/src/types/reducerActionTypes';
import createActionTypes from '@/src/utils/createActionTypes';
import { modalWindowType, questionDataType } from '@/src/types/reducerInitialTypes';
import { testReceiveType } from '@/src/types/receiveTypes';

interface BaseSliceInterface {
  modalWindow: modalWindowType;
  questions: questionDataType[];
  currentQuestion: questionDataType | undefined;
  currentTest: testReceiveType | undefined;
}

const modalWindowSlice = createSlice({
  name: 'baseSlice',
  initialState: {
    modalWindow: undefined,
    questions: [],
    currentQuestion: undefined,
    currentTest: undefined,
  } as BaseSliceInterface,
  reducers: {
    setModalWindowState: (state, data: setModalWindowActionType) => {
      state.modalWindow = data.payload;
    },

    setCurrentQuestionState: (state, question: addCurrentQuestionActionType) => {
      state.currentQuestion = question.payload;
    },

    addLocalQuestionState: (state, question: addQuestionActionType) => {
      state.questions =
        state.questions.length > 0
          ? [...state.questions, question.payload]
          : [question.payload];
    },

    deleteLocalQuestionState: (state, question: deleteQuestionActionType) => {
      state.questions.filter((elem) => elem.id !== question.payload.id);
    },
  },
});

export const modalWindowActionTypes = createActionTypes({
  actions: modalWindowSlice.actions,
  actionKeys: Object.keys(modalWindowSlice),
});
export const {
  setModalWindowState,
  setCurrentQuestionState,
  addLocalQuestionState,
  deleteLocalQuestionState,
} = modalWindowSlice.actions;
export default modalWindowSlice.reducer;
