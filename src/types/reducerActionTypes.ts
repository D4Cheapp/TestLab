import {
  paginationTestsReceiveType,
  profileLogoutReceiveType,
  testReceiveType,
} from '@/src/types/receiveTypes';
import { currentProfileType } from '@/src/types/reducerInitialTypes';
import {
  createTestRequestType,
  paginationTestRequestType,
  profileLoginRequestType,
  profileRegisterRequestType,
} from '@/src/types/requestTypes';
import { PayloadAction } from '@reduxjs/toolkit';

export type profileRegisterActionType = PayloadAction<profileRegisterRequestType>;
export type profileLoginActionType = PayloadAction<profileLoginRequestType>;
export type setCurrentProfileActionType = PayloadAction<currentProfileType>;
export type profileLogoutActionType = PayloadAction<profileLogoutReceiveType>;

export type createTestActionType = PayloadAction<createTestRequestType>;
export type testEditActionType = PayloadAction<{ id: number } & createTestRequestType>;
export type deleteTestActionType = PayloadAction<{ id: number }>;
export type getTestActionType = PayloadAction<{ id: number }>;
export type setTestActionType = PayloadAction<testReceiveType>;
export type getPaginationTestActionType = PayloadAction<paginationTestRequestType>;
export type setPaginationTestActionType = PayloadAction<paginationTestsReceiveType>;

export type setLoadinfStateActionType = PayloadAction<boolean>;
export type setErrorStateActionType = PayloadAction<string>;
export type deleteErrorStateActionType = PayloadAction<number>;
