import {
  createQuestionRecieveType,
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
  createQuestoinRequestType,
  createAnswerRequestType,
} from '@/src/types/requestTypes';
import { PayloadAction } from '@reduxjs/toolkit';

export type profileRegisterActionType = PayloadAction<profileRegisterRequestType>;
export type profileLoginActionType = PayloadAction<profileLoginRequestType>;
export type setCurrentProfileActionType = PayloadAction<currentProfileType>;
export type profileLogoutActionType = PayloadAction<profileLogoutReceiveType>;

export type createTestActionType = PayloadAction<createTestRequestType>;
export type editTestActionType = PayloadAction<{ id: number } & createTestRequestType>;
export type deleteTestActionType = PayloadAction<{ id: number }>;
export type getTestActionType = PayloadAction<{ id: number }>;
export type setTestActionType = PayloadAction<testReceiveType>;
export type getPaginationTestActionType = PayloadAction<paginationTestRequestType>;
export type setPaginationTestActionType = PayloadAction<paginationTestsReceiveType>;

export type createQuestionActionType = PayloadAction<createQuestoinRequestType>;
export type editQuestionActionType = PayloadAction<createQuestionRecieveType & { id: number }>;
export type deleteQuestionActionType = PayloadAction<{ id: number }>;

export type createAnswerActionType = PayloadAction<
  createAnswerRequestType & { question_id: number }
>;
export type editAnswerActionType = PayloadAction<createAnswerRequestType & { id: number }>;
export type moveAnswerActionType = PayloadAction<{ id: number; position: number }>;
export type deleteAnswerActionType = PayloadAction<{ id: number }>;

export type setLoadinfStateActionType = PayloadAction<boolean>;
export type setErrorStateActionType = PayloadAction<string>;
export type deleteErrorStateActionType = PayloadAction<number>;
