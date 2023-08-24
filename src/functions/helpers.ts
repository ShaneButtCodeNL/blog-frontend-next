import { BlogPostReturn, SortTypes } from "@/models/blogPostReturn";
import { UserDetails } from "@/models/userReturn";
import { store } from "@/store";
import { setBlogId, setBody, setParentCommentId } from "@/store/commentReply";
import {
  setAccessToken,
  setLoggedIn,
  setUserDetails,
  setLogin,
  setLogout,
} from "@/store/login";
import { logoutServerFunction } from "./serverFunctions";

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
  sessionStorage.setItem(USER_DETAILS, JSON.stringify(userDetails));
  store.dispatch(setLogin({ accessToken: token, userDetails }));
};

export const setLogoutDetails = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(USER_DETAILS);
  }
  store.dispatch(setLogout());
};

export const getHighestRole = (userDetails: UserDetails) => {
  if (userDetails.roles.includes("ROLE_OWNER")) return "Owner";
  if (userDetails.roles.includes("ROLE_ADMIN")) return "Admin";
  if (userDetails.roles.includes("ROLE_WRITER")) return "Writer";
  if (userDetails.roles.includes("ROLE_USER")) return "User";
  return "No Role";
};

export const formatNumber = (number: number): string => {
  if (number >= 1_000_000_000) return (number % 1000000000) + "B";
  if (number >= 1_000_000) return (number % 1000000) + "M";
  if (number >= 1_000) return (number % 1000) + "K";
  return number.toString();
};

export function closeLoginModal() {
  "use client";
  const modal = document.getElementById("login-modal") as HTMLDialogElement;
  if (!modal) return;
  modal.close();
}
export function openLoginModal() {
  "use client";
  const modal = document.getElementById("login-modal") as HTMLDialogElement;
  if (!modal) return;
  modal.showModal();
}

export function openMakeCommentReplyModal(blogId: string) {
  "use client";
  if (blogId === "") return;
  store.dispatch(setBlogId(blogId));
  const modal = document.getElementById(
    "make-comment-reply-modal"
  ) as HTMLDialogElement;
  modal.showModal();
}
export function closeMakeCommentReplyModal() {
  "use client";
  store.dispatch(setBlogId(""));
  store.dispatch(setParentCommentId(""));
  store.dispatch(setBody(""));
  store.dispatch(setParentCommentId(""));
  const modal = document.getElementById(
    "make-comment-reply-modal"
  ) as HTMLDialogElement;
  modal.close();
}

export function applySorting(
  list: BlogPostReturn[],
  sortType?: SortTypes | null | undefined
) {
  if (sortType) {
    let sortFun;
    switch (sortType) {
      case SortTypes.DATE_ASC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        break;
      }
      case SortTypes.DATE_DEC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        break;
      }
      case SortTypes.LIKES_ASC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          a.likes.length - b.likes.length;
        break;
      }
      case SortTypes.LIKES_DEC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          b.likes.length - a.likes.length;
        break;
      }
      case SortTypes.TITLE_ASC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          a.title.localeCompare(b.title);
        break;
      }
      case SortTypes.TITLE_ASC: {
        sortFun = (a: BlogPostReturn, b: BlogPostReturn) =>
          b.title.localeCompare(a.title);
        break;
      }
    }
    return [...list].sort(sortFun);
  }
  return list;
}

export function applyTitleFilter(list: BlogPostReturn[], titleSnipit: string) {
  if (!titleSnipit || titleSnipit.length === 0) return list;
  else
    return list.filter(
      (v) =>
        v.title.toLocaleLowerCase().indexOf(titleSnipit.toLocaleLowerCase()) !==
        -1
    );
}
