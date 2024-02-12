import { createSelector } from '@reduxjs/toolkit';
import { RootStateType } from '..';

const selector = (state: RootStateType) => state.test;
export const testListSelector = createSelector(selector, (state) => state.testList);
export const currentTestSelector = createSelector(selector, (state) => state.currentTest);
export const testMetaSelector = createSelector(selector, (state) => state.testMeta);
