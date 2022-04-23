import * as React from "react";
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
            by <em>{problem.author}</em>
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
          className="button is-link is-fullwidth is-rounded"
          href={`/problem/${problem.id}`}
        >
          Visit Challenge
        </a>
      )}
    </div>
  );
}
