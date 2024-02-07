import { createSelector } from '@reduxjs/toolkit';
import { RootStateType } from '..';

const selector = (state: RootStateType) => state.auth;
export const currentProfileSelector = createSelector(
  selector,
  (state) => state.currentProfile,
);
