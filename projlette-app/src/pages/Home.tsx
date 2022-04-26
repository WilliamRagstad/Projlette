import * as React from "react";
// @ts-ignore
import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";
// @ts-ignore
import Header from "../components/header/Header";

export default function Home() {
  const tab = useLocation().pathname.split("/")[1].toLowerCase();

  return (
    <div className="App">
      {/*
      <Header />
      <section className="hero is-medium is-info">
        <div className="hero-body">
          <div className="container">
            <p className="title">Welcome to Projlette</p>
            <p className="subtitle">A roulette game for programming project challenges!</p>
          </div>
        </div>
      </section>
	  */}

      <section className="hero is-medium is-info">
        <div className="hero-head">
          <Header />
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">Welcome to Projlette!</p>
            <p className="subtitle">
              A roulette game for programming project challenges
            </p>
          </div>
        </div>

        <div className="hero-foot">
          <nav className="tabs is-boxed is-fullwidth is-medium">
            <div className="container">
              <ul>
                <li
                  className={tab === "" ? "is-active" : ""}
                >
                  <Link to="/">
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    Generate Challenge
                  </Link>
                </li>
                <li
                  className={tab === "all" ? "is-active" : ""}
                >
                  <Link to="/all">
                    <span className="icon is-small">
                      <i className="fas fa-list"></i>
                    </span>
                    All Challenges
                  </Link>
                </li>
                <li
                  className={tab === "submit" ? "is-active" : ""}
                >
                  <Link to="/submit">
                    <span className="icon is-small">
                      <i className="fas fa-upload"></i>
                    </span>
                    Submit Challenge
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Outlet />
        </div>
      </section>

      <section className="section spacing"></section>

      <Footer/>
    </div>
  );
}
