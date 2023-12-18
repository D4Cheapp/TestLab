/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import {
  deleteErrorStateActionType,
  setErrorStateActionType,
  setLoadingStateActionType,
} from '@/src/types/reducerActionTypes';
import createActionTypes from '@/src/utils/createActionTypes';

interface BaseSliceInterface {
  loadingState: boolean;
  errors: string[];
}

const baseSlice = createSlice({
  name: 'baseSlice',
  initialState: {
    loadingState: false,
    modalWindow: undefined,
    questions: [],
    errors: [],
  } as BaseSliceInterface,
  reducers: {
    setLoadingState: (state, isLoading: setLoadingStateActionType) => {
      state.loadingState = isLoading.payload;
    },

    setErrorsState: (state, errors: setErrorStateActionType) => {
      const isPayloadEmpty = errors.payload !== undefined;
      if (isPayloadEmpty) {
        state.errors = [...state.errors, errors.payload];
      } else {
        state.errors = [];
      }
    },

    deleteErrorState: (state, errorIndex: deleteErrorStateActionType) => {
      state.errors = state.errors.filter(
        (error, index) => index !== errorIndex.payload,
      );
    },
  },
});

export const baseActionTypes = createActionTypes({
  actions: baseSlice.actions,
  actionKeys: Object.keys(baseSlice),
});
export const { setLoadingState, setErrorsState, deleteErrorState } =
  baseSlice.actions;
export default baseSlice.reducer;
