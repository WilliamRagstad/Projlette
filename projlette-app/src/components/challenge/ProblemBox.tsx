import { doc, getDoc } from "firebase/firestore";
import * as React from "react";
import { db } from "../../firebase/firebase";
import {
  challengeColor,
  renderApproved,
  renderDifficulty,
  renderTags,
} from "./ChallengeHelper";

export default function ProblemBox({ problem, linkToProblem = false }) {
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
          This problem {problem.approved ? "is officially" : "is not yet"}{" "}
          approved&nbsp;&nbsp;
          {renderApproved(problem.approved)}
        </div>
      </div>
      {linkToProblem && (
        <a
          className="button is-link is-fullwidth is-rounded mb-4"
          href={`/problem/${problem.id}`}
        >
          Visit Challenge
        </a>
      )}
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
    </div>
  );
}
