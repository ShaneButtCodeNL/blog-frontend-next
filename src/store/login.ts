import { UserDetails } from "@/models/userReturn";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  loggedIn: boolean;
  userDetails: UserDetails | null;
  accessToken: string;
}

export interface LoginValues {
  userDetails: UserDetails;
  accessToken: string;
}

const initialState: LoginState = {
  loggedIn: false,
  userDetails: null,
  accessToken: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setLogin: (state, action: PayloadAction<LoginValues>) => {
      state.loggedIn = true;
      state.userDetails = action.payload.userDetails;
      state.accessToken = action.payload.accessToken;
    },
    setLogout: (state) => {
      state.loggedIn = false;
      state.accessToken = "";
      state.userDetails = null;
    },
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const {
  setLoggedIn,
  setUserDetails,
  setLogin,
  setLogout,
  setAccessToken,
} = loginSlice.actions;
export const isLoggedIn = (state: any) => state.login.loggedIn;
export default loginSlice.reducer;
