import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div id="my-links-div" className="footer-div">
        <div className="footer-title">My Links</div>
        <Link href="https://shanebuttcodenl.github.io/" target="_blank">
          <div id="home-page" className="footer-item">
            <FontAwesomeIcon icon={faHome} /> My HomePage
          </div>
        </Link>
        <Link href="https://github.com/ShaneButtCodeNL" target="_blank">
          <div id="git-hub" className="footer-item">
            <FontAwesomeIcon icon={faGithub} /> My Github
          </div>
        </Link>
        <Link
          href="https://www.linkedin.com/in/shane-butt-134812146/"
          target="_blank"
        >
          <div id="linkdin" className="footer-item">
            <FontAwesomeIcon icon={faLinkedinIn} /> My LinkedIn
          </div>
        </Link>
      </div>

      <div id="tech-used-footer-div" className="footer-div">
        <div className="footer-title">Tech Used</div>
        <Link href={"https://nextjs.org/"} target="_blank">
          <div id="next-div" title="FrontEnd" className="footer-item">
            Next.js
          </div>
        </Link>
        <Link href="https://spring.io/" target="_blank">
          <div id="java-spring-div" title="Back End" className="footer-item">
            Java Spring
          </div>
        </Link>
        <Link href={"https://www.mongodb.com/"} target="_blank">
          <div id="database-div" title="Database" className="footer-item">
            MongoDB
          </div>
        </Link>
      </div>
    </footer>
  );
}
