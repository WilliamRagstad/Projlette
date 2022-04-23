import * as React from "react";
// @ts-ignore
import AllChallenges from "./challenge/AllChallenges.tsx";
// @ts-ignore
import GenerateChallenge from "./challenge/GenerateChallenge.tsx";
// @ts-ignore
import SubmitChallenge from "./challenge/SubmitChallenge.tsx";
// @ts-ignore
import Header from "./header/Header.tsx";

function App() {
  const [tab, setTab] = React.useState(0);

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
                  className={tab === 0 ? "is-active" : ""}
                  onClick={() => setTab(0)}
                >
                  <a href="#generate">
                    <span className="icon is-small">
                      <i className="fas fa-plus"></i>
                    </span>
                    Generate Challenge
                  </a>
                </li>
                <li
                  className={tab === 1 ? "is-active" : ""}
                  onClick={() => setTab(1)}
                >
                  <a href="#all">
                    <span className="icon is-small">
                      <i className="fas fa-list"></i>
                    </span>
                    All Challenges
                  </a>
                </li>
                <li
                  className={tab === 2 ? "is-active" : ""}
                  onClick={() => setTab(2)}
                >
                  <a href="#submit">
                    <span className="icon is-small">
                      <i className="fas fa-upload"></i>
                    </span>
                    Submit Challenge
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {[<GenerateChallenge />, <AllChallenges />, <SubmitChallenge />][tab]}
        </div>
      </section>

	  <section className="section spacing"></section>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Projlette</strong> by{" "}
            <a href="https://twitter.com/WilliamRagstad">William Rågstad</a>,
            Copyright © {new Date().getFullYear()}. The source code is licensed
            under{" "}
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
