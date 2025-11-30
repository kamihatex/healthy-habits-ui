import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof reduxStore>;
export type AppDispatch = AppStore["dispatch"];
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const reduxStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });

  return store;
};

export default reduxStore;
