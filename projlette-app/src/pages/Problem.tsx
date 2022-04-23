import * as React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  challengeColor,
  renderTags,
} from "../components/challenge/ChallengeHelper";
// @ts-ignore
import Header from "../components/header/Header";
import { apiFetch } from "../util/api";

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = React.useState(null);
  useEffect(() => {
    apiFetch(`/problem/${id}`)
      .then((res) => res.json())
      .then(setProblem);
  }, []);
  return (
    <div className="App">
      <section className="hero is-small is-info">
        <div className="hero-head">
          <Header />
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              {problem ? problem.title : "Unknown Problem"}
            </h1>
            <h2 className="subtitle">
              By <em>{problem ? problem.author : "Unknown Author"}</em> /{" "}
              {problem
                ? new Date(problem.createdDate).toLocaleDateString()
                : ""}
            </h2>
            <br />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              {problem && (
                <div className="box">
                  <h1 className="title">{problem.title}</h1>
                  <h2 className="subtitle">
                    <span style={{ color: challengeColor(problem.id) }}>
                      <b>{problem.id}</b>
                    </span>{" "}
                    by <em>{problem.author}</em>
                  </h2>
                  <p>
                    <h3 className="subtitle is-5">Description</h3>
                    {problem.description}
                  </p>
                  <br />
                  {renderTags(problem.tags)}
                </div>
              )}
            </div>
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
