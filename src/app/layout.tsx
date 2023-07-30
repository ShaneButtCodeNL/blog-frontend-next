import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import PreloadLogin from "@/components/PreloadLogin";
import LoginModal from "@/components/modals/LoginModal";
import MakeCommentReplyModal from "@/components/modals/MakeCommentReplyModal";
import Footer from "@/components/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
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
        <LoginModal />
        <Providers>
          <MakeCommentReplyModal />
        </Providers>
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
          <Footer />
        </div>
      </body>
    </html>
  );
}
