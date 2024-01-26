import { PayloadAction } from '@reduxjs/toolkit';
import {
  PaginationTestsReceiveType,
  ProfileLogoutReceiveType,
  TestReceiveType,
} from '@/src/types/receiveTypes';
import { CurrentProfileType } from '@/src/types/reducerInitialTypes';
import {
  CreateTestRequestType,
  PaginationTestRequestType,
  ProfileLoginRequestType,
  ProfileRegisterRequestType,
  CreateQuestionRequestType,
  CreateAnswerRequestType,
} from '@/src/types/requestTypes';

export type ProfileRegisterActionType = PayloadAction<ProfileRegisterRequestType>;
export type ProfileLoginActionType = PayloadAction<ProfileLoginRequestType>;
export type SetCurrentProfileActionType = PayloadAction<CurrentProfileType | undefined>;
export type ProfileLogoutActionType = PayloadAction<ProfileLogoutReceiveType>;

export type CreateTestActionType = PayloadAction<CreateTestRequestType>;
export type EditTestActionType = PayloadAction<{ id: number } & CreateTestRequestType>;
export type DeleteTestActionType = PayloadAction<{ id: number }>;
export type GetTestActionType = PayloadAction<{ id: number }>;
export type SetCurrentTestActionType = PayloadAction<TestReceiveType | undefined>;
export type GetPaginationTestActionType = PayloadAction<PaginationTestRequestType>;
export type SetPaginationTestActionType = PayloadAction<
  PaginationTestsReceiveType & PaginationTestRequestType
>;

export type AddLocalQuestionActionType = PayloadAction<CreateQuestionRequestType>;
export type EditLocalQuestionAction = PayloadAction<CreateQuestionRequestType>;
export type AddCurrentQuestionActionType = PayloadAction<
  CreateQuestionRequestType | undefined
>;
export type DeleteQuestionActionType = PayloadAction<{ id: number; test_id?: number }>;
export type CreateQuestionActionType = PayloadAction<CreateQuestionRequestType>;
export type EditQuestionActionType = PayloadAction<
  CreateQuestionRequestType & { id: number; test_id?: number }
>;
export type CreateAnswerActionType = PayloadAction<
  CreateAnswerRequestType & { question_id: number }
>;
export type EditAnswerActionType = PayloadAction<
  CreateAnswerRequestType & { id: number }
>;
export type MoveAnswerActionType = PayloadAction<{
  id: number;
  position: number;
}>;
export type DeleteAnswerActionType = PayloadAction<{ id: number }>;

export type SetLoadingStateActionType = PayloadAction<boolean>;
export type SetErrorStateActionType = PayloadAction<string>;
export type DeleteErrorStateActionType = PayloadAction<number>;
