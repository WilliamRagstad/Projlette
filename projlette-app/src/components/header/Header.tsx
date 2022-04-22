import * as React from "react";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  return (
    <header className="App-header">
      <nav
        className="container navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a href="/" className="navbar-item">
            <img src="/logo.png" className="navbar-logo" />
          </a>
          <a
            href="#"
            role="button"
            className={"navbar-burger " + (hamburgerOpen ? "is-active": '')}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
			onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className={"navbar-menu " + (hamburgerOpen ? "is-active": '')}>
          <div className="navbar-start">
            <a href="/about" className="navbar-item">
              About
            </a>

            <a
              href="https://twitter.com/WilliamRagstad"
              className="navbar-item"
              target="_blank"
            >
              <span className="icon is-medium">
                <i className="fab fa-twitter"></i>
              </span>
              Follow Me
            </a>
          </div>
          {/*
		<div className="navbar-end">
		  <div className="navbar-item">
			<div className="buttons">
			  <a href="#" className="button is-primary">
				<strong>Sign up</strong>
			  </a>
			  <a href="#" className="button is-light">
				Log in
			  </a>
			</div>
		  </div>
		</div>
		*/}
        </div>
      </nav>
    </header>
  );
}
