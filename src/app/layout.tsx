import Search from "../components/Search";
import Nav from "../components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Provider";
import LoginModal from "@/components/modals/LoginModal";
import Footer from "@/components/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { cookies } from "next/headers";
import { store } from "@/store";
import { loginInit } from "@/functions/apiController";
import { setLogin } from "@/store/login";
import dynamic from "next/dynamic";
import SplashPage from "@/components/SplashPage";
import Image from "next/image";
import titleImage from "../../public/SB-icon-16x16-dark.svg";
const MakeCommentModal = dynamic(
  () => import("@/components/modals/MakeCommentModal")
);
const MakeCommentReplyModal = dynamic(
  () => import("@/components/modals/MakeCommentReplyModal")
);
const DeletePostModal = dynamic(
  () => import("@/components/modals/DeletePostModal")
);
const RestorePostModal = dynamic(
  () => import("@/components/modals/RestorePostModal")
);
const KillPostModal = dynamic(
  () => import("@/components/modals/KillPostModal")
);
const EditPostModal = dynamic(
  () => import("@/components/modals/EditPostModal")
);
const DeleteCommentModal = dynamic(
  () => import("@/components/modals/DeleteCommentModal")
);
const RestoreCommentModal = dynamic(
  () => import("@/components/modals/RestoreCommentModal")
);
const EditCommentModal = dynamic(
  () => import("@/components/modals/EditCommentModal")
);
const KillCommentModal = dynamic(
  () => import("@/components/modals/KillCommentModal")
);
const PreloadLogin = dynamic(
  () => import("@/components/preloaders/PreloadLogin"),
  { ssr: false, loading: () => <SplashPage /> }
);

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
  const jwt = cookies().get("jwt");
  let accessToken, refreshToken, userDetails;
  if (jwt) {
    const res = await loginInit(jwt.value);
    if (res) {
      accessToken = res.access.token;
      userDetails = res.details;
      refreshToken = res.refresh.token;
      store.dispatch(setLogin({ accessToken, userDetails }));
    }
  }
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
              <div className="title-container">
                <Image
                  src={titleImage}
                  alt="My Icon"
                  objectFit="contain"
                  height={30}
                  title="Shane's Blog"
                />
                <div className="title title-not-break">Shane's Blog</div>
                <div className="title title-break">
                  Shane's
                  <br className="title-brake" /> Blog
                </div>
              </div>
              <Providers>
                <PreloadLogin
                  accessToken={accessToken}
                  userDetails={userDetails}
                >
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
