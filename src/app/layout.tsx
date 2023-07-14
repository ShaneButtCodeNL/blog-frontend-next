import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import { AppDispatch, RootState, store } from "@/store";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setLoggedIn, setUserDetails } from "@/store/login";
import { UserDetails } from "@/models/userReturn";
import { isTokenValid } from "@/functions/apiController";
import validateTokenFunction from "./actions";
import { revalidatePath } from "next/cache";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shane's Personal Blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="page">
          <header>
            <div className="title">Shane's Blog</div>
            <Search title="Hello" />
            <Providers>
              <Nav />
            </Providers>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
