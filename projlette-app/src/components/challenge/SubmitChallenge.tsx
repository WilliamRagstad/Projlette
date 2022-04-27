import { doc, getDoc, setDoc } from "firebase/firestore";
import * as React from "react";
import { Link } from "react-router-dom";
import { auth, db, getCurrentUser } from "../../firebase/firebase";
import { formatUsername } from "../../util/user";
import { challengeColor } from "./ChallengeHelper";

export default function SubmitChallenge() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [createdProblem, setCreatedProblem] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState<any>(auth.currentUser ? {source: auth.currentUser} : null);

  React.useEffect(() => {
	getCurrentUser().then(setCurrentUser);
  },[]);

  const randomFrom = (list: string) => {
    return list[Math.floor(Math.random() * list.length)];
  };

  const generateProblemId = (): Promise<string> => {
    return new Promise(async (resolve) => {
      // A problem id starts with a letter, then two numbers and then a letter
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      let id =
        randomFrom(letters) +
        randomFrom(numbers) +
        randomFrom(numbers) +
        randomFrom(letters);
      if (await problemByIdExists(id)) {
        // If the id already exists, generate a new one
        id = await generateProblemId();
      }
      resolve(id);
    });
  };

  const problemByIdExists = (id: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const problem = await getDoc(doc(db, "problems", id));
      if (problem && problem.exists() && problem.data()) resolve(true);
      const awaitingProblem = await getDoc(doc(db, "problems-awaiting", id));
      if (awaitingProblem && awaitingProblem.exists() && awaitingProblem.data())
        resolve(true);
      resolve(false);
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.source) {
      setErrorMessage("You must be logged in to submit a problem");
      return;
    }
	if (!currentUser.name) {
		setErrorMessage("The current user profile has not yet been loaded! Please wait a moment and try again.");
		return;
	}
    console.log("Submitting...");
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const difficulty = (
      document.getElementById("difficulty") as HTMLSelectElement
    ).value;
    const tags = (document.getElementById("tags") as HTMLInputElement).value
      .split(",")
      .map((t) => t.trim().toLowerCase());
    // Generate unique id
    generateProblemId().then((id) => {
      const data = {
        id: id,
        title: title,
        description: description,
        difficulty: difficulty,
        tags: tags,
        author: doc(db, "users/" + formatUsername(currentUser.username)),
		authorName: currentUser.username,
      };
      setDoc(doc(db, "problems-awaiting", id), data)
        .then(() => {
          setCreatedProblem(data);
        })
        .catch((error) => {
          setErrorMessage(`Failed to submit: ${error.message}.`);
        });
    });
  };

  return (
    <div id="submit">
      <div className="block">
        <h1 className="title">Submit Challenge</h1>
        <h2 className="subtitle">
          Submit your own challenges and programming problems to the community.
        </h2>
      </div>
      <br />
      {createdProblem ? (
        <div className="box">
          <h1 className="title">Thank You!</h1>
          <h2 className="subtitle">
            Challenge:{" "}
            <b>
              <span style={{ color: challengeColor(createdProblem.id) }}>
                {createdProblem.id}
              </span>{" "}
              {createdProblem.title}{" "}
            </b>
          </h2>
          Your programming challenge/problem has been submitted for review. It
          will be considered for inclusion in the official challenge set, and
          accepted or rejected within <b>7 days</b>.
          <br />
          Meanwhile, you can view the status of your challenge at any time by
          visiting the following link:
          <br />
          <br />
          <a className="button is-link" href={`/problem/${createdProblem.id}`}>
            Preview Challenge
          </a>
          <br />
          <br />
          <a href="/">&lt; Return to the challenge list</a>.
        </div>
      ) : (!currentUser || !currentUser.source) ? (
        <div className="has-text-centered">
          <p className="subtitle has-text-danger">
            You must be logged in to submit a challenge!
          </p>
          <div className="buttons is-centered">
            <Link to="/signup" className="button is-success">
              Sign up
            </Link>
            <Link to="/login" className="button is-light">
              Log in
            </Link>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Title of the problem"
                id="title"
                required
              />
              <p className="help">
                Short title for the problem. For example,{" "}
                <code>Calculator</code>, <code>Maze Solver</code>, etc.
              </p>
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Description of the problem in detail"
                id="description"
                required
              ></textarea>
              <p className="help">
                First sentences should be a short summary of the problem to
                catch the reader's attention.
              </p>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control ">
              <label className="label">Difficulty</label>
              <div className="control">
                <div className="select">
                  <select id="difficulty" required>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="control is-expanded">
              <label className="label">Tags</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="List tags separated by commas"
                  id="tags"
                  required
                />
              </div>
              <p className="help">
                Tags are used to categorize challenges. For example:{" "}
                <code>
                  algorithms, data structures, recursion, binary search
                </code>
                , etc.
              </p>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" id="tos" required />
                &nbsp; I agree to the{" "}
                <Link to="/terms" target="_blank">
                  terms and conditions
                </Link>
              </label>
            </div>
          </div>

          <br />
          <div className="field is-grouped">
            <p className="control">
              <input
                type="submit"
                className="button is-success"
                value="Submit Challenge"
              />
            </p>
            <p className="control">
              <a className="button is-light">Cancel</a>
            </p>
          </div>
          <br />
          <h1 className="title is-5 has-text-danger">{errorMessage}</h1>
        </form>
      )}
    </div>
  );
}
