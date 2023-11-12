import { PayloadAction } from '@reduxjs/toolkit';
import {loginInfoType, registerInfoType} from "@/src/types/requestTypes";
import {currentProfileType} from "@/src/types/reducerInitialTypes";
import {profileLogoutType} from "@/src/types/receiveTypes";

export type profileRegisterActionType = PayloadAction<registerInfoType>;
export type profileLoginActionType = PayloadAction<loginInfoType>;
export type setCurrentProfileActionType = PayloadAction<currentProfileType>;
export type deleteCurrentProfileActionType = PayloadAction<profileLogoutType>;
export type setLoadinfStateActionType = PayloadAction<boolean>;
export type setErrorStateActionType = PayloadAction<string>;
export type deleteErrorStateActionType = PayloadAction<number>;
