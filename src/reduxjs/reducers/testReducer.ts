/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import createActionTypes from '@/src/utils/createActionTypes';
import { currentProfileType } from '@/src/types/reducerInitialTypes';
import {
  deleteCurrentProfileActionType, deleteErrorStateActionType,
  profileLoginActionType,
  profileRegisterActionType,
  setCurrentProfileActionType,
  setErrorStateActionType,
  setLoadinfStateActionType,
} from '@/src/types/reducerActionTypes';

interface TestSliceInterface {
  currentProfile: currentProfileType;
  loadingState: boolean;
  errors: string[];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: { currentProfile: undefined, loadingState: false, errors: [] } as TestSliceInterface,
  reducers: {
    profileRegister: (state, profileInfo: profileRegisterActionType) => {},

    profileLogin: (state, profileInfo: profileLoginActionType) => {},

    profileLogout: (state) => {},

    getCurrentProfile: (state) => {},

    setCurrentProfile: (state, profileInfo: setCurrentProfileActionType) => {
      state.currentProfile = profileInfo.payload;
    },

    deleteCurrentProfile: (state, isSuccess: deleteCurrentProfileActionType) => {
      if (isSuccess.payload.success) {
        state.currentProfile = null;
      }
    },

    setLoadingState: (state, isLoading: setLoadinfStateActionType) => {
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

export const sliceActions = Object.keys(testSlice);
export type testSliceActionType = typeof testSlice.actions;
export const actionTypes = createActionTypes({ actions: testSlice.actions });

export const {
  profileRegister,
  profileLogin,
  profileLogout,
  getCurrentProfile,
  setCurrentProfile,
  deleteCurrentProfile,
  setLoadingState,
  setErrorsState,
  deleteErrorState,
} = testSlice.actions;
export default testSlice.reducer;