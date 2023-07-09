import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import { store } from "@/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shane's Personal Blog",
};

export default function RootLayout({
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
              <Nav loggedIn={store.getState().login.loggedIn} />
            </Providers>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
