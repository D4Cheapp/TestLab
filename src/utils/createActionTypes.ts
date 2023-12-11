import { CaseReducerActions } from '@reduxjs/toolkit';

type createActionType = ({
  actions,
  actionKeys,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: CaseReducerActions<any, any>;
  actionKeys: string[];
}) => {
  [key in (typeof actionKeys)[number]]: string;
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
