import * as React from "react";
import { apiFetch } from "../../util/api";
import { challengeColor } from "./ChallengeHelper";

export default function SubmitChallenge() {
  const [submitMessage, setSubmitMessage] = React.useState("");
  const [createdId, setCreatedId] = React.useState(null);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting...");
    const title = document.getElementById("title") as HTMLInputElement;
    const description = document.getElementById(
      "description"
    ) as HTMLTextAreaElement;
    const difficulty = document.getElementById(
      "difficulty"
    ) as HTMLSelectElement;
    const tags = document.getElementById("tags") as HTMLInputElement;
    const author = document.getElementById("author") as HTMLInputElement;
    // console.log(title, description, difficulty, tags, author);
    apiFetch("/problem/", {
      method: "POST",
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        difficulty: difficulty.value,
        tags: tags.value.split(",").map((t) => t.trim().toLowerCase()),
        author: author.value,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          setCreatedId(json.id);
        });
      } else {
        res
          .text()
          .then((text) => {
            setSubmitMessage(`Error: ${text}`);
          })
          .catch((err) => {
            setSubmitMessage(`Error (${res.statusText}): ${err}`);
          });
      }
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
      {!createdId ? (
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
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Briefly state the problem description here"
                id="description"
                required
              ></textarea>
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
            <label className="label">Author</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="Your name"
                id="author"
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" id="tos" required />
                &nbsp; I agree to the <a href="#">terms and conditions</a>
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

          <p>{submitMessage}</p>
        </form>
      ) : (
        <div className="box">
          <h1 className="title">Thank You!</h1>
          <h2 className="subtitle">Challenge ID: <span style={{ color: challengeColor(createdId) }}><b>{createdId}</b></span></h2>
          Your programming challenge/problem has been submitted for review. It will be considered
            for inclusion in the official challenge set, and accepted or rejected within{" "}
            <b>7 days</b>.
            <br />
			Meanwhile, you can view the status of your challenge at any time by visiting
            the following link:
			<br /><br />
            <a className="button is-link" href={`/problem/${createdId}`}>Preview Challenge</a>
            <br />
            <br />
            <a href="/">&lt; Return to the challenge list</a>.
        </div>
      )}
    </div>
  );
}
