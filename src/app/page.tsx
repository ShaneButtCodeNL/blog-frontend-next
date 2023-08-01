import LatestBlogPost from "@/components/LatestBlogPost";
import { store } from "@/store";
import Link from "next/link";

export default function Home() {
  return (
    <div id="home-page-div">
      <h1>Welcome to Shane's Blog</h1>
      <section id="project-info-section">
        <h2>Details about this project</h2>
        <p>
          I created this as a learning project to teach myself how to use Java
          Spring and Next.js. This project uses Next.js to handle the front end
          and uses Java Spring to create an API that connects to a NoSQL mongoDB
          database. This project also has Authorization and Authentication.
          Authentication is handled using java springs security and
          Authorization is handled using{" "}
          <span title="JSON Web Tokens">JWTs</span>.
        </p>
      </section>
      <section>
        <h2>Latest Post</h2>
        <LatestBlogPost />
        {"SEARCH: " + store.getState().search.search}
      </section>
    </div>
  );
}
