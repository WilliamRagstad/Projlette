import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, getCurrentUser } from "../../firebase/firebase";
import "./Header.css";

export default function Header() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [user, setUser] = useState<any>(
    auth.currentUser ? { source: auth.currentUser } : null
  );
  const navigator = useNavigate();

  React.useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const onSignOut = () => {
    auth.signOut();
    setUser(null);
    navigator("/");
  };

  return (
    <header className="App-header">
      <nav
        className="container navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src="/logo.svg" className="navbar-logo" />
          </Link>
          <a
            href="#"
            role="button"
            className={"navbar-burger " + (hamburgerOpen ? "is-active" : "")}
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

        <div
          id="navbarBasicExample"
          className={"navbar-menu " + (hamburgerOpen ? "is-active" : "")}
        >
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Generate
            </Link>
            <Link to="/all" className="navbar-item">
              All
            </Link>
            <Link to="/submit" className="navbar-item">
              Submit
            </Link>
            <Link to="/about" className="navbar-item">
              About
            </Link>

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

          <div className="navbar-end">
            {(user && user.source) ? (
              <div className="navbar-item buttons">
                <div className="mr-5">
					Logged in as&nbsp;
                  <strong>{user.username ?? user.source.email}</strong>
                </div>
                <button className="button" onClick={onSignOut}>
                  Log out
                </button>
              </div>
            ) : (
              <div className="navbar-item buttons">
                <Link to="/signup" className="button is-success">
                  Sign up
                </Link>
                <Link to="/login" className="button is-light">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
