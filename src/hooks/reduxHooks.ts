import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { appDispatchType, rootStateType } from '@/src/types/reduxTypes';

export const useAppDispatch: () => appDispatchType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<rootStateType> = useSelector;
