import {store} from "@/src/reduxjs/store";

export type rootStateType = ReturnType<typeof store.getState>;
export type appDispatchType = typeof store.dispatch;
