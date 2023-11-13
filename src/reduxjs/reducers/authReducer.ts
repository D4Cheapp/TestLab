/* eslint @typescript-eslint/no-unused-vars: 0 */
import {
  profileLoginActionType,
  profileLogoutActionType,
  profileRegisterActionType,
  setCurrentProfileActionType,
} from '@/src/types/reducerActionTypes';
import { currentProfileType } from '@/src/types/reducerInitialTypes';
import createActionTypes from '@/src/utils/createActionTypes';
import { createSlice } from '@reduxjs/toolkit';

interface AuthSilceInterface {
  currentProfile: currentProfileType;
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    currentProfile: undefined,
  } as AuthSilceInterface,
  reducers: {
    profileRegister: (state, profileInfo: profileRegisterActionType) => {},

    profileLogin: (state, profileInfo: profileLoginActionType) => {},

    profileLogout: (state) => {},

    getCurrentProfile: (state) => {},

    setCurrentProfile: (state, profileInfo: setCurrentProfileActionType) => {
      console.log(profileInfo.payload);
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
