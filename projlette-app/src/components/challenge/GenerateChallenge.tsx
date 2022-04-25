import * as React from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../util/api";
import { challengeColor, renderTags } from "./ChallengeHelper";
import Wheel from "./Wheel";
import ProblemBox from "./ProblemBox";

export default function GenerateChallenge() {
  const [winner, setWinner] = useState(null);

  const generator = async (count) => {
    // Fetch the data from the API
    const response = await apiFetch("/problem/random/" + count);
    return await response.json();
  };

  const segmentWidth = 200;
  const segmentHeight = 120;
  const segmentComponent = (problem, index) => {
    return (
      <div
        className="segment-body"
        style={{
          width: segmentWidth,
          height: segmentHeight,
        }}
      >
        <div className="segment-title">
          <b>
            <span style={{ color: challengeColor(problem.id) }}>
              {problem.id}
            </span>{" "}
            {problem.title}
          </b>
        </div>
        <div className="max-three-lines">{problem.description}</div>
      </div>
    );
  };
  const [start, setStart] = useState(false);
  const onDone = (winner, index) => {
    setStart(false);
    setWinner(winner);
    // console.log("The winner is: ", index, "-", winner);
  };
  const onFail = (msg) => {
    setStart(false);
    setWinner(null);
    // console.log("Failed: ", msg);
  };
  return (
    <div id="generate">
      <div className="block">
        <h1 className="title">Generate Challenge</h1>
        <h2 className="subtitle">
          Generate a set of new programming project challenges that can be used
          to test and improve your skills. Spin the wheel to randomly select a
          challenge from the list of existing challenges.
        </h2>
      </div>
      <br />
      <br />
      <div className="columns is-centered">
        <div className="column is-two-thirds">
          <div className="box">
            <h1 className="title">Wheel of Challenges</h1>
            <p>
              Spin the wheel and test your skills against the challenge that you
              have been given.
            </p>
            <Wheel
              segmentGenerator={generator}
              initialSegmentCount={20}
              onDone={onDone}
              onFail={onFail}
              shouldStart={start}
              segmentComponent={segmentComponent}
              segmentWidth={segmentWidth}
              spinDuration={2000}
              spinLengthMax={4000}
            />
            <div className="buttons is-centered">
              <button
                className={
                  "button is-success is-large is-fullwidth is-rounded " +
                  (start ? "is-loading" : "")
                }
                onClick={() => setStart(true)}
              >
                <span className="icon" style={{ marginRight: 5 }}>
                  <i className="fas fa-sync"></i>
                </span>
                Spin!
              </button>
            </div>
          </div>
          {winner && <ProblemBox problem={winner} linkToProblem={true} />}
        </div>
      </div>
    </div>
  );
}
