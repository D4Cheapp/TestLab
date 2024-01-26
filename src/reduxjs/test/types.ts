import { PayloadAction } from '@reduxjs/toolkit';
import { PaginationTestsReceiveType, TestReceiveType } from '@/src/types/receiveTypes';
import {
  CreateAnswerRequestType,
  CreateQuestionRequestType,
  CreateTestRequestType,
  PaginationTestRequestType,
} from '@/src/types/requestTypes';

export type CurrentTestType = {
  id?: number;
  title?: string;
  questions?: CreateQuestionRequestType[];
};

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
