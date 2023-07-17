import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import PreloadLogin from "@/components/PreloadLogin";
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
      <PreloadLogin />
      <body className={inter.className}>
        <div id="page">
          <header style={{ paddingTop: "1em", paddingBottom: "1em" }}>
            <div id="header-content">
              <div className="title">Shane's Blog</div>
              <Search title="Hello" />
              <Providers>
                <Nav />
              </Providers>
            </div>
          </header>
          <main>
            <div id="main-body-content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
