import * as React from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../util/api";
import Wheel from "./Wheel";

export default function GenerateChallenge() {
  const colors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
  ];

  const generator = async (count) => {
    // Fetch the data from the API
    const response = await apiFetch("/problem/random/" + count);
    return await response.json();
  };

  const segmentWidth = 180;
  const segmentHeight = 150;
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
            <span style={{ color: colors[index % colors.length] }}>
              {problem.id}
            </span>{" "}
            {problem.title}
          </b>
        </div>
        <div className="segment-description">{problem.description}</div>
      </div>
    );
  };
  const [start, setStart] = useState(false);
  const onDone = (winner, index) => {
    setStart(false);
    console.log("The winner is: ", index, "-", winner);
  };
  const onFail = (msg) => {
    setStart(false);
    console.log("Failed: ", msg);
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
      <div className="block">
        <h1 className="title">Goal</h1>
        <h2 className="subtitle">
          The goal of the challenge is to write a program that solves the
          problem given in the challenge in the best possible way to your
          capabilities and skill level. Share your solution with your peers and
          the community, get constructive feedback from others, and improve your
          skills.
        </h2>
      </div>
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
        </div>
      </div>
    </div>
  );
}
