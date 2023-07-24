import { UserDetails } from "@/models/userReturn";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  loggedIn: boolean;
  userDetails: UserDetails | null;
}

const initialState: LoginState = {
  loggedIn: false,
  userDetails: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    login: (state) => {
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
    setUserDetails: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
    },
  },
});

export const { setLoggedIn, setUserDetails } = loginSlice.actions;
export const isLoggedIn = (state: any) => state.login.loggedIn;
export default loginSlice.reducer;
