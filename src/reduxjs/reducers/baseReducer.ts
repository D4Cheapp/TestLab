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
    errors: [],
  } as BaseSliceInterface,
  reducers: {
    setLoadingState: (state, isLoading: setLoadingStateActionType) => {
      state.loadingState = isLoading.payload;
    },

    setErrorsState: (state, errors: setErrorStateActionType) => {
      if (errors.payload !== undefined) {
        state.errors = [...state.errors, errors.payload];
      } else {
        state.errors = [];
      }
    },

    deleteErrorState: (state, errorIndex: deleteErrorStateActionType) => {
      state.errors = state.errors.filter((error, index) => index !== errorIndex.payload);
    },
  },
});


export const baseActionTypes = createActionTypes({
  actions: baseSlice.actions,
  actionKeys: Object.keys(baseSlice),
});
export const { setLoadingState, setErrorsState, deleteErrorState } = baseSlice.actions;
export default baseSlice.reducer;
