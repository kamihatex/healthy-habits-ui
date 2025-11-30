import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name?: string;
  // add other user fields you get from your API
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.user;
export const selectCurrentToken = (state: { user: UserState }) =>
  state.user.token;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;

// === USAGE IN YOUR LOGIN COMPONENT ===
/*
import { useDispatch } from 'react-redux';
import { setCredentials } from './userSlice';
import { authService } from './api';

function LoginComponent() {
  const dispatch = useDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // Assuming your API returns { user: {...}, token: "..." }
      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));
      
      // Navigate to dashboard or home
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    // your login form JSX
  );
}
*/

// === USAGE IN OTHER COMPONENTS ===
/*
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './userSlice';

function SomeComponent() {
  const user = useSelector(selectCurrentUser);
  
  // Now you can use user.id for your API calls!
  // Example: fetchHabits(user.id)
  
  return <div>Welcome {user?.name}</div>;
}
*/
