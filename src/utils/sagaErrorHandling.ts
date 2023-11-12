import { put } from 'redux-saga/effects';
import { setErrorsState, setLoadingState } from '@/src/reduxjs/reducers/testReducer';

const createErrorsString = (response: object): string => {
  return Object.entries(response).map(([key, value]): string => {
    const errorType: string = (key.charAt(0).toUpperCase() + key.slice(1)).replace('_', ' ');
    return `${errorType} ${value}`;
  })[0];
};

function* sagaErrorHandling(
  isResponseOk: boolean,
  response: object | undefined,
  action?: () => void,
) {
  if (!isResponseOk && response) {
    const errors = createErrorsString(response);
    yield put(setErrorsState(errors));
  } else if (response instanceof Error) {
    yield put(setErrorsState(response.message));
  }

  if (action) {
    yield action();
  }

  yield put(setLoadingState(false));
}

export { sagaErrorHandling };
