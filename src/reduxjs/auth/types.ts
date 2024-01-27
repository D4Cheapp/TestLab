import { PayloadAction } from '@reduxjs/toolkit';
import {
  ProfileLoginRequestType,
  ProfileRegisterRequestType,
} from '@/src/types/requestTypes';
import { ProfileLogoutReceiveType } from '@/src/types/receiveTypes';

export type CurrentProfileType = {
  id: number;
  username: string;
  is_admin: boolean;
} | null;

export type ProfileRegisterActionType = PayloadAction<ProfileRegisterRequestType>;
export type ProfileLoginActionType = PayloadAction<ProfileLoginRequestType>;
export type SetCurrentProfileActionType = PayloadAction<CurrentProfileType | undefined>;
export type ProfileLogoutActionType = PayloadAction<ProfileLogoutReceiveType>;
