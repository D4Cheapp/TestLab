/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import {
  ProfileLoginActionType,
  ProfileLogoutActionType,
  ProfileRegisterActionType,
  SetCurrentProfileActionType,
  CurrentProfileType,
} from './types';

interface AuthSliceInterface {
  currentProfile?: CurrentProfileType;
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    currentProfile: undefined,
  } as AuthSliceInterface,
  reducers: {
    profileRegister: (state, profileInfo: ProfileRegisterActionType) => state,

    profileLogin: (state, profileInfo: ProfileLoginActionType) => state,

    profileLogout: (state) => state,

    getCurrentProfile: (state) => state,

    setCurrentProfile: (state, profileInfo: SetCurrentProfileActionType) => {
      state.currentProfile = profileInfo.payload;
    },

    deleteCurrentProfile: (state, isSuccess: ProfileLogoutActionType) => {
      const isDeleteSuccess = isSuccess.payload.success;
      if (isDeleteSuccess) {
        state.currentProfile = null;
      }
    },
  },
});

export const authActions = authSlice.actions; 
export const {
  profileRegister,
  profileLogin,
  profileLogout,
  getCurrentProfile,
  setCurrentProfile,
  deleteCurrentProfile,
} = authSlice.actions;
export default authSlice.reducer;
