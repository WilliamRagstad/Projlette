import * as React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
// @ts-ignore
import Header from "../components/header/Header";

export default function About() {
  return (
    <div className="App">
      <section className="hero is-small is-info">
        <div className="hero-head">
          <Header />
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">About Projlette</p>
            <p className="subtitle">We're all about fun and learning!</p>
            <br />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="block">
                <h1 className="title">Goal</h1>
                <h2 className="subtitle">
                  The goal of the challenge is to write a program that solves
                  the problem given in the challenge in the best possible way to
                  your capabilities and skill level.
                  <br />
                  Share your solution with your peers and the community, get
                  constructive feedback from others, and improve your skills.
                </h2>
                <a
                  href={
                    "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(
                      "I solve programming challenges on @Projlette!🎉\n#projlette"
                    )
                  }
                  className="button"
                  target="_blank"
                >
                  <span className="icon is-medium">
                    <i className="fab fa-twitter"></i>
                  </span>
                  &nbsp;&nbsp; Share on Twitter
                </a>
              </div>
            </div>
            <div className="column">
              <div className="block">
                <h1 className="title">How it Works</h1>
                <h2 className="subtitle">
                  The challenges are designed to be as easy as possible (in
                  theory). Then it's up to you to write the code and perfect it
                  as much as you can.
                  <br />
                  <br />
                  Randomly pick a challenge on the homepage to get started.
                </h2>
                <Link to="/" className="button">
                  <span className="icon">
                    <i className="fas fa-code"></i>
                  </span>
                  &nbsp;&nbsp; Pick a challenge
                </Link>
              </div>
            </div>
            <div className="column">
              <div className="block">
                <h1 className="title">Submit Problems</h1>
                <h2 className="subtitle">
                  Have you recently solved a challenge of your own outside of
                  Projlette, and feel like it could be suitable for a challenge?
                  <br />
                  <br />
                  Submit it to the challenge page to share it with the
                  community.
                </h2>
                <Link to="/submit" className="button">
                  <span className="icon">
                    <i className="fas fa-lightbulb"></i>
                  </span>
                  &nbsp;&nbsp; Submit your challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
