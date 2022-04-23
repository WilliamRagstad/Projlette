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
  const [error, setError] = React.useState("");
  const [solutions, setSolutions] = React.useState(null);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  useEffect(() => {
    apiFetch(`/problem/${id}`)
      .then((res) => res.json())
      .then(setProblem)
      .catch(setError);
    apiFetch(`/solutions/${id}`).then((res) => {
      if (res.ok) {
        return res.json().then(setSolutions);
      }
    });
  }, []);
  const onSubmitSolution: React.MouseEventHandler<HTMLAnchorElement> = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const githubUrl = (document.getElementById("githubUrl") as HTMLInputElement)
      .value;
    const language = (document.getElementById("language") as HTMLSelectElement)
      .value;
    const author = (document.getElementById("author") as HTMLInputElement)
      .value;
    apiFetch(`/solutions/${id}`, {
      method: "POST",
      body: JSON.stringify({
        githubUrl,
        language,
        author,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          setSubmitSuccess(`Successfully submitted solution to ${id}!`);
          setSubmitError("");
          setSolutions([...solutions, json]);
        });
      } else {
        res
          .text()
          .then((text) => {
            setSubmitError(`Failed to submit: ${text}.`);
          })
          .catch((err) => {
            setSubmitError(`Error (${res.statusText}): ${err}.`);
          });
      }
    });
  };
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
              {problem ? (
                <>
                  <br />
                  <div className="box">
                    <h1 className="title">{problem.title}</h1>
                    <h2 className="subtitle">
                      <span style={{ color: challengeColor(problem.id) }}>
                        <b>{problem.id}</b>
                      </span>{" "}
                      by <em>{problem.author}</em>
                    </h2>
                    <h3 className="subtitle is-5 mb-1">Description</h3>
                    <p>{problem.description}</p>
                    <br />
                    {renderTags(problem.tags)}
                  </div>
                  <br />

                  <div className="block">
                    <h1 className="title">Solutions</h1>
                    <h2 className="subtitle">Community solutions</h2>

                    {solutions && solutions.length > 0 ? (
                      <table className="table is-bordered is-fullwidth is-striped is-narrow is-hoverable">
                        <thead>
                          <tr>
                            <th>Link</th>
                            <th>Language</th>
                            <th>Author</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solutions.map((solution, i) => (
                            <tr key={i}>
                              <td>
                                <a href={solution.githubUrl} target="_blank">
                                  {solution.githubUrl}
                                </a>
                              </td>
                              <td>{solution.language}</td>
                              <td>
                                <em>{solution.author}</em>
                              </td>
                              <td>
                                {new Date(
                                  solution.createdDate
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>
                        No solutions have been submitted yet for this problem.
                      </p>
                    )}
                  </div>

                  <div className="block">
                    <h1 className="title">Have you solved this problem?</h1>
                    <h2 className="subtitle">
                      Add your solution to the list above
                    </h2>
                    <p>
                      Submit a link to the repository with your solution using
                      the form below. We will briefly review your solution and
                      add it to the list of selected solutions in the list
                      above.
                    </p>
                    <br />

                    {submitSuccess ? (
                      <p className="has-text-success">
                        <b>{submitSuccess}</b>
                      </p>
                    ) : (
                      <form className="form">
                        <label className="label">Submit your solution</label>
                        <div className="field">
                          <div className="control">
                            <div className="field  has-addons">
                              <div className="control is-expanded">
                                <input
                                  className="input"
                                  type="text"
                                  placeholder="Github repository"
                                  id="githubUrl"
								  required
                                />
                                <p className="help">
                                  Link to the repository with your solution.
                                </p>
                              </div>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  placeholder="Programming language"
                                  id="language"
                                />
                                <p className="help">
                                  The language of the solution
                                </p>
                              </div>
                              <div className="control">
                                <input
                                  className="input"
                                  type="text"
                                  placeholder="Your name"
                                  id="author"
								  required
                                />
                                <p className="help">
                                  Alias or first name is fine
                                </p>
                              </div>
                              <div className="control">
                                <a
                                  className="button is-info"
                                  onClick={onSubmitSolution}
                                >
                                  Send
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

						<p className="has-text-danger">
							<b>{submitError}</b>
						</p>
                      </form>
                    )}
                  </div>
                  <br />
                </>
              ) : error ? (
                <div className="block">
                  <h1 className="title">Error</h1>
                  <h2 className="subtitle">{error}</h2>
                </div>
              ) : (
                <p>Loading...</p>
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