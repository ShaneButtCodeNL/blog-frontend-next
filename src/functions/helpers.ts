import { UserDetails } from "@/models/userReturn";
import { store } from "@/store";
import login, { setLoggedIn, setUserDetails } from "@/store/login";

const TOKEN = "token";
const USER_DETAILS = "userDetails";

export const getDateString = (input: Date): string => {
  const date = new Date(input);
  return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  }/${date.getFullYear()}`;
};

export const debounceFunction = (fn: Function, timeout: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this.args), timeout);
  };
};

export const debounceFunctionAsync = async (fn: Function, timeout: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return async function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(async () => await fn.apply(this.args), timeout);
  };
};

export const getDateInXHours = (hours: number) => {
  const date = new Date();
  return new Date(date.valueOf() + 1000 * 60 * 60 * hours);
};

export const setLoginDetails = (token: string, userDetails: UserDetails) => {
  "use client";
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails));
  store.dispatch(setLoggedIn(true));
  store.dispatch(setUserDetails(userDetails));
};

export const setLogoutDetails = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER_DETAILS);
  store.dispatch(setLoggedIn(false));
  store.dispatch(setUserDetails(null));
};
