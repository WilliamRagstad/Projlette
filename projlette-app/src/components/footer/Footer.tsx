import * as React from "react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>Projlette</strong> by{" "}
          <a href="https://twitter.com/WilliamRagstad" target="_blank">
            William Rågstad
          </a>
          , Copyright © {new Date().getFullYear()}. The source code is licensed
          under{" "}
          <a
            href="http://opensource.org/licenses/mit-license.php"
            target="_blank"
          >
            MIT
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
