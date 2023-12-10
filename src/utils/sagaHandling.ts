import { call, put } from 'redux-saga/effects';
import { setErrorsState, setLoadingState } from '@/src/reduxjs/reducers/baseReducer';
import { createFetch } from '@/src/utils/createFetch';

type sagaHandlingPropsType<T> = {
  href: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  action?: (data?: T) => void;
  isDataInAction?: boolean;
};

const createErrorsString = (response: { error: string }): string => {
  return Object.entries(response).map(([key, value]): string => {
    const errorType: string = (key.charAt(0).toUpperCase() + key.slice(1)).replace('_', ' ');
    return `${errorType}: ${value}`;
  })[0];
};

function* sagaHandling<T>({
  href,
  method,
  body,
  action,
  isDataInAction,
}: sagaHandlingPropsType<T>) {
  yield put(setLoadingState(true));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response: [T | { error: string }, Response] | Error = yield call(() =>
    createFetch<T>({
      method,
      href,
      body: body ?? undefined,
    }),
  );

  if (response instanceof Error) {
    yield put(setErrorsState(response.message));
  } else {
    // @ts-ignore
    if (!response[1].ok && 'error' in response[0]) {
      const errors = createErrorsString(response[0]);
      yield put(setErrorsState(errors));
    }
  }

  if (action !== undefined) {
    if (isDataInAction) {
      yield action();
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      yield action(response[0]);
    } else {
      yield action();
    }
  }

  yield put(setLoadingState(false));
}

export { sagaHandling };
