import { sliceActions, testSliceActionType } from '@/src/reduxjs/reducers/testReducer';

type createActionType = ({ actions }: { actions: testSliceActionType }) => {
  [key in (typeof sliceActions)[number]]: string;
};

const createActionTypes: createActionType = ({ actions }) =>
  Object.keys(actions).reduce(
    (acc, key) =>
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      ({ ...acc, [key]: actions[key].type }),
    {},
  );

export default createActionTypes;
