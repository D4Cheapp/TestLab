/* eslint @typescript-eslint/no-unused-vars: 0 */
import { paginationTestsReceiveType, testReceiveType } from '@/src/types/receiveTypes';
import {
  createTestActionType,
  deleteErrorStateActionType,
  deleteTestActionType,
  getPaginationTestActionType,
  getTestActionType,
  profileLoginActionType,
  profileLogoutActionType,
  profileRegisterActionType,
  setCurrentProfileActionType,
  setErrorStateActionType,
  setLoadinfStateActionType,
  setPaginationTestActionType,
  setTestActionType,
  testEditActionType,
} from '@/src/types/reducerActionTypes';
import { currentProfileType } from '@/src/types/reducerInitialTypes';
import createActionTypes from '@/src/utils/createActionTypes';
import { createSlice } from '@reduxjs/toolkit';

interface TestSliceInterface {
  currentProfile: currentProfileType;
  currentTest: testReceiveType | undefined;
  tests: testReceiveType[];
  testsMeta: paginationTestsReceiveType['meta'];
  loadingState: boolean;
  errors: string[];
}

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {
    currentProfile: undefined,
    currentTest: undefined,
    tests: [],
    testsMeta: { total_count: 5, total_pages: 0 },
    loadingState: false,
    errors: [],
  } as TestSliceInterface,
  reducers: {
    profileRegister: (state, profileInfo: profileRegisterActionType) => {},

    profileLogin: (state, profileInfo: profileLoginActionType) => {},

    profileLogout: (state) => {},

    getCurrentProfile: (state) => {},

    setCurrentProfile: (state, profileInfo: setCurrentProfileActionType) => {
      state.currentProfile = profileInfo.payload;
    },

    deleteCurrentProfile: (state, isSuccess: profileLogoutActionType) => {
      if (isSuccess.payload.success) {
        state.currentProfile = null;
      }
    },

    createTest: (state, action: createTestActionType) => {},

    editTest: (state, action: testEditActionType) => {},

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
  createTest,
  editTest,
  deleteTest,
  getTest,
  setTest,
  getPaginationTests,
  setPaginationTests,
  setLoadingState,
  setErrorsState,
  deleteErrorState,
} = testSlice.actions;
export default testSlice.reducer;
