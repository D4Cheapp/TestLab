import { createSlice } from '@reduxjs/toolkit';
import createActionTypes from '@/src/utils/createActionTypes';

const testSlice = createSlice({
  name: 'testSlice',
  initialState: {},
  reducers: {},
});

export const sliceActions = Object.keys(testSlice);
export type testSliceActionType = typeof testSlice.actions;
export const actionTypes = createActionTypes({ actions: testSlice.actions });

export const {} = testSlice.actions;
export default testSlice.reducer;