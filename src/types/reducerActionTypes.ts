import { PayloadAction } from '@reduxjs/toolkit';
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
  createQuestionRequestType,
  createAnswerRequestType,
} from '@/src/types/requestTypes';

export type profileRegisterActionType = PayloadAction<profileRegisterRequestType>;
export type profileLoginActionType = PayloadAction<profileLoginRequestType>;
export type setCurrentProfileActionType = PayloadAction<currentProfileType | undefined>;
export type profileLogoutActionType = PayloadAction<profileLogoutReceiveType>;

export type createTestActionType = PayloadAction<createTestRequestType>;
export type editTestActionType = PayloadAction<{ id: number } & createTestRequestType>;
export type deleteTestActionType = PayloadAction<{ id: number }>;
export type getTestActionType = PayloadAction<{ id: number }>;
export type setCurrentTestActionType = PayloadAction<testReceiveType | undefined>;
export type getPaginationTestActionType = PayloadAction<paginationTestRequestType>;
export type setPaginationTestActionType = PayloadAction<
  paginationTestsReceiveType & paginationTestRequestType
>;

export type addLocalQuestionActionType = PayloadAction<createQuestionRequestType>;
export type editLocalQuestionAction = PayloadAction<createQuestionRequestType>;
export type addCurrentQuestionActionType = PayloadAction<
  createQuestionRequestType | undefined
>;
export type deleteQuestionActionType = PayloadAction<{ id: number; test_id?: number }>;
export type createQuestionActionType = PayloadAction<createQuestionRequestType>;
export type editQuestionActionType = PayloadAction<
  createQuestionRequestType & { id: number; test_id?: number }
>;
export type createAnswerActionType = PayloadAction<
  createAnswerRequestType & { question_id: number }
>;
export type editAnswerActionType = PayloadAction<
  createAnswerRequestType & { id: number }
>;
export type moveAnswerActionType = PayloadAction<{
  id: number;
  position: number;
}>;
export type deleteAnswerActionType = PayloadAction<{ id: number }>;

export type setLoadingStateActionType = PayloadAction<boolean>;
export type setErrorStateActionType = PayloadAction<string>;
export type deleteErrorStateActionType = PayloadAction<number>;
