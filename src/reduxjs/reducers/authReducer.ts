/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import {
  profileLoginActionType,
  profileLogoutActionType,
  profileRegisterActionType,
  setCurrentProfileActionType,
} from '@/src/types/reducerActionTypes';
import { currentProfileType } from '@/src/types/reducerInitialTypes';
import createActionTypes from '@/src/utils/createActionTypes';

interface AuthSliceInterface {
  currentProfile: currentProfileType;
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    currentProfile: undefined,
  } as AuthSliceInterface,
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
  },
});

export const authActionTypes = createActionTypes({
  actions: authSlice.actions,
  actionKeys: Object.keys(authSlice),
});

export const {
  profileRegister,
  profileLogin,
  profileLogout,
  getCurrentProfile,
  setCurrentProfile,
  deleteCurrentProfile,
} = authSlice.actions;
export default authSlice.reducer;
