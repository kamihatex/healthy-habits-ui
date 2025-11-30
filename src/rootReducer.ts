import { combineReducers } from "@reduxjs/toolkit";
import userInfo from "./slices/userSlice";

const rootReducer = combineReducers({
  userInfo,
});

export default rootReducer;
