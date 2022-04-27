import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import * as React from "react";
import { db, getCurrentUser } from "../../firebase/firebase";
import {
  challengeColor,
  renderApproved,
  renderDifficulty,
  renderTags,
} from "./ChallengeHelper";

export default function ProblemBox({ problem, linkToProblem = false }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);
  return (
    <div className="box">
      <div className="columns is-gapless is-mobile">
        <div className="column">
          <h1 className="title">{problem.title}</h1>
          <h2 className="subtitle">
            <span style={{ color: challengeColor(problem.id) }}>
              <b>{problem.id}</b>
            </span>{" "}
            by <em>{problem.authorName ?? "Unknown"}</em>
          </h2>
        </div>
        <div className="column has-text-right">
          <h3 className="subtitle mb-1">
            Difficulty&nbsp;&nbsp;{renderDifficulty(problem.difficulty)}
          </h3>
        </div>
      </div>

      <h3 className="subtitle mb-1">Description</h3>
      <p>{problem.description}</p>
      <br />
      <div className="columns is-gapless is-mobile">
        <div className="column">{renderTags(problem.tags)}</div>
        <div className="column has-text-right">
          This problem {problem.approved ? "is officially" : "has not been"}{" "}
          approved&nbsp;&nbsp;
          {renderApproved(problem.approved)}
        </div>
      </div>
      <div className="action-links is-size-7">
        <a
          href="#"
          className="mr-3"
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/problem/${problem.id}`
            )
          }
        >
          <i className="fas fa-link"></i> Copy Link
        </a>
        <a
          href={
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(
              "Check out the programming challenge '" +
                problem.title +
                "' on @Projlette!\nhttps://projlette.com/problem/" +
                problem.id
            )
          }
          target="_blank"
          className="mr-3"
        >
          <i className="fab fa-twitter"></i> Share on Twitter
        </a>
        <a href="#" className="mr-3">
          <i className="fas fa-heart"></i> Favorite
        </a>
        <a href="#">
          <i className="fas fa-flag"></i> Report
        </a>
      </div>
      {linkToProblem && (
        <a
          className="button is-link is-fullwidth is-rounded mt-4"
          href={`/problem/${problem.id}`}
        >
          Visit Challenge
        </a>
      )}
      {user && user.role === "admin" ? (
        <div className="block mt-5">
          <hr />
          <h1 className="title">Admin Controls</h1>
          <h2 className="subtitle">
            Manage different aspects of this challenge.
          </h2>
          <div className="buttons is-centered">
            <button
              className="button is-danger"
              disabled={problem.approved}
              onClick={() => {
                if (problem.approved) {
                  alert(
                    "Cannot delete an approved challenge! Unapprove it before preceding."
                  );
                  return;
                }
                if (
                  window.confirm(
                    `Are you sure you want to delete this problem? (${problem.id})`
                  )
                ) {
                  deleteDoc(doc(db, "problems-awaiting", problem.id))
                    .then(() => {
                      window.location.reload();
                    })
                    .catch(alert);
                }
              }}
            >
              Delete
            </button>
            {problem.approved ? (
              <button
                className="button is-warning"
                onClick={() => {
					getDoc(doc(db, "problems", problem.id)).then(
						(oldSnap) => {
						  if (!oldSnap.exists()) {
							alert("This challenge could not be found!");
							return;
						  }
						  setDoc(doc(db, "problems-awaiting", problem.id), oldSnap.data())
							.then(() =>
							  deleteDoc(doc(db, "problems", problem.id))
							)
							.then(() => {
								window.location.reload();
							});
						}
					  );
                }}
              >
                Unapprove
              </button>
            ) : (
              <button
                className="button is-success"
                onClick={() => {
                  // Create a new document in problems
                  getDoc(doc(db, "problems-awaiting", problem.id)).then(
                    (oldSnap) => {
                      if (!oldSnap.exists()) {
                        alert("This challenge is already awaiting approval!");
                        return;
                      }
                      setDoc(doc(db, "problems", problem.id), oldSnap.data())
                        .then(() =>
                          deleteDoc(doc(db, "problems-awaiting", problem.id))
                        )
                        .then(() => {
							window.location.reload();
                        });
                    }
                  );
                }}
              >
                Approve
              </button>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
