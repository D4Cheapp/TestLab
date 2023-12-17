import { PayloadAction } from '@reduxjs/toolkit';
import {
  createQuestionReceiveType,
  paginationTestsReceiveType,
  profileLogoutReceiveType,
  testReceiveType,
} from '@/src/types/receiveTypes';
import {
  currentProfileType,
  modalWindowType,
  questionDataType,
} from '@/src/types/reducerInitialTypes';
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
export type setCurrentProfileActionType = PayloadAction<currentProfileType>;
export type profileLogoutActionType = PayloadAction<profileLogoutReceiveType>;

export type createTestActionType = PayloadAction<createTestRequestType>;
export type editTestActionType = PayloadAction<{ id: number } & createTestRequestType>;
export type deleteTestActionType = PayloadAction<{ id: number }>;
export type getTestActionType = PayloadAction<{ id: number }>;
export type setTestActionType = PayloadAction<testReceiveType>;
export type getPaginationTestActionType = PayloadAction<paginationTestRequestType>;
export type setPaginationTestActionType = PayloadAction<
  paginationTestsReceiveType & paginationTestRequestType
>;

export type setModalWindowActionType = PayloadAction<modalWindowType>;
export type addQuestionActionType = PayloadAction<
  questionDataType & { isEdit: boolean | undefined }
>;
export type addCurrentQuestionActionType = PayloadAction<questionDataType | undefined>;
export type deleteQuestionActionType = PayloadAction<{ id: number }>;
export type createQuestionActionType = PayloadAction<createQuestionRequestType>;
export type editQuestionActionType = PayloadAction<
  createQuestionReceiveType & { id: number }
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
