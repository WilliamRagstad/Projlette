import * as React from "react";
// @ts-ignore
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// @ts-ignore
import Header from "../components/header/Header";

export default function NoPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <section className="hero is-medium is-info">
        <div className="hero-head">
          <Header />
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">Oops! Page not found.</p>
            <p className="subtitle">
              It looks like the page you're looking for doesn't exist.
            </p>
            <br />
            <a
              href="#"
              className="button is-link is-large"
              onClick={() => navigate(-1)}
            >
              <span className="icon is-small">
                <i className="fas fa-arrow-left"></i>
              </span>
              <span>Go Back</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Projlette</strong> by{" "}
            <a href="https://twitter.com/WilliamRagstad" target="_blank">
              William Rågstad
            </a>
            , Copyright © {new Date().getFullYear()}. The source code is
            licensed under{" "}
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
    </div>
  );
}
