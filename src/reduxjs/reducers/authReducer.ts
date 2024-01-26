/* eslint @typescript-eslint/no-unused-vars: 0 */
import { createSlice } from '@reduxjs/toolkit';
import {
  ProfileLoginActionType,
  ProfileLogoutActionType,
  ProfileRegisterActionType,
  SetCurrentProfileActionType,
} from '@/src/types/reducerActionTypes';
import { CurrentProfileType } from '@/src/types/reducerInitialTypes';
import createActionTypes from '@/src/utils/createActionTypes';

interface AuthSliceInterface {
  currentProfile?: CurrentProfileType;
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    currentProfile: undefined,
  } as AuthSliceInterface,
  reducers: {
    profileRegister: (state, profileInfo: ProfileRegisterActionType) => {},

    profileLogin: (state, profileInfo: ProfileLoginActionType) => {},

    profileLogout: (state) => {},

    getCurrentProfile: (state) => {},

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
