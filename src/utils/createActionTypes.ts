import { sliceActions, testSliceActionType } from '@/src/reduxjs/reducers/testReducer';

type createActionType = ({ actions }: { actions: testSliceActionType }) => {
  [key in (typeof sliceActions)[number]]: string;
};

const createActionTypes: createActionType = ({ actions }) =>
  Object.keys(actions).reduce(
    (acc, key) =>
      // @ts-ignore
      ({ ...acc, [key]: actions[key].type }),
    {},
  );

export default createActionTypes;
