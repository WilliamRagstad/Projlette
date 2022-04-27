import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import * as React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProblemBox from "../components/challenge/ProblemBox";
import Footer from "../components/footer/Footer";
// @ts-ignore
import Header from "../components/header/Header";
import { db } from "../firebase/firebase";
import { apiFetch } from "../util/api";
import { setProp } from "../util/prop";

export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = React.useState(null);
  const [error, setError] = React.useState("");
  const [solutions, setSolutions] = React.useState(null);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState("");
  useEffect(() => {
	// fetch problem
    getDoc(doc(db, "problems", id)).then(snap => {
		if (snap.exists()) {
			setProblem(setProp(snap.data(), {
				approved: true
			}));
		} else {
			// Try find awaiting problem
			getDoc(doc(db, "problems-awaiting", id)).then(snap => {
				if (snap.exists()) {
					setProblem(setProp(snap.data(), {
						approved: false
					}));
				} else {
					setError("Problem not found");
				}
			});
		}
	});
	  // TODO: Fetch all solutions
	  getDocs(collection(db, "problems", id, "solutions")).then(snap => {
		  setSolutions(snap.docs.map(doc => doc.data()));
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
	  // TODO: Submit new awaiting solution
    // apiFetch(`/solutions/${id}`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     githubUrl,
    //     language,
    //     author,
    //   }),
    // }).then((res) => {
    //   if (res.ok) {
    //     res.json().then((json) => {
    //       setSubmitSuccess(`Successfully submitted solution to ${id}!`);
    //       setSubmitError("");
    //       setSolutions([...solutions, json]);
    //     });
    //   } else {
    //     res
    //       .text()
    //       .then((text) => {
    //         setSubmitError(`Failed to submit: ${text}.`);
    //       })
    //       .catch((err) => {
    //         setSubmitError(`Error (${res.statusText}): ${err}.`);
    //       });
    //   }
    // });
  };

  console.log(solutions);


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
              By <em>{problem ? problem.authorName : "Unknown Author"}</em> /{" "}
              {problem
                ? problem.created.toDate().toLocaleDateString()
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
                  <ProblemBox problem={problem}/>
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
                                <em>{solution.authorName}</em>
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

      <Footer/>
    </div>
  );
}
