import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  loggedIn: boolean;
  userDetails: any;
  testCount: number;
}

const initialState: LoginState = {
  loggedIn: false,
  userDetails: null,
  testCount: 3,
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
    setTestCount: (state, action: PayloadAction<number>) => {
      state.testCount = action.payload;
    },
  },
});

export const { setLoggedIn, setUserDetails, setTestCount } = loginSlice.actions;
export const isLoggedIn = (state: any) => state.login.loggedIn;
export default loginSlice.reducer;
