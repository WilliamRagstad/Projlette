import * as React from "react";
// @ts-ignore
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
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

      <Footer/>
    </div>
  );
}
