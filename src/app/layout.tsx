import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import PreloadLogin from "@/components/preloaders/PreloadLogin";
import LoginModal from "@/components/modals/LoginModal";
import MakeCommentReplyModal from "@/components/modals/MakeCommentReplyModal";
import Footer from "@/components/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import MakeCommentModal from "@/components/modals/MakeCommentModal";
import DeletePostModal from "@/components/modals/DeletePostModal";
import RestorePostModal from "@/components/modals/RestorePostModal";
import KillPostModal from "@/components/modals/KillPostModal";
import EditPostModal from "@/components/modals/EditPostModal";
import DeleteCommentModal from "@/components/modals/DeleteCommentModal";
import RestoreCommentModal from "@/components/modals/RestoreCommentModal";
import EditCommentModal from "@/components/modals/EditCommentModal";
import KillCommentModal from "@/components/modals/KillCommentModal";
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
      <body className={inter.className}>
        <LoginModal />
        <Providers>
          {
            //Post Modals
          }
          <DeletePostModal />
          <RestorePostModal />
          <KillPostModal />
          <MakeCommentModal />
          <EditPostModal />
          {
            //Comment Modals
          }
          <MakeCommentReplyModal />
          <RestoreCommentModal />
          <DeleteCommentModal />
          <KillCommentModal />
          <EditCommentModal />
        </Providers>
        <div id="page">
          <header style={{ paddingTop: "1em", paddingBottom: "1em" }}>
            <div id="header-content">
              <div className="title">Shane's Blog</div>
              <Providers>
                <PreloadLogin>
                  <Search title="Hello" />
                  <Nav />
                </PreloadLogin>
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
