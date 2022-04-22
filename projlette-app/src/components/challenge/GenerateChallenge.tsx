import * as React from "react";
import { useEffect, useState } from "react";
import Wheel from "./Wheel";

export default function GenerateChallenge() {
  const segments = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
    "won a voucher",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
    "won a voucher",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
  ];
  const colors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
  ];

  // Temporary generator
  let generatorIndex = 0;
  const generator = (count) => {
    // TODO: Fetch the data from the API
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(segments[generatorIndex++ % segments.length]);
    }
    return result;
  };

  const segmentComponent = (problem, index) => {
    return (
      <div
        className="segment-body"
        style={{
          width: 150,
          height: 100,
        }}
      >
        <div
          className="segment-title"
          style={{ color: colors[index % colors.length] }}
        >
          {problem}
        </div>
        <div className="segment-description">{problem}</div>
      </div>
    );
  };
  const [start, setStart] = useState(false);
  const onDone = (winner, index) => {
    setStart(false);
    console.log("The winner is: ", index, '-', winner);
  };
  return (
    <div id="generate">
      <h1 className="title">Generate Challenge</h1>
      <h2 className="subtitle">
        Generate a set of new programming project challenges that can be used to
        test and improve your skills. Spin the wheel to randomly select a
        challenge from the list of existing challenges.
      </h2>
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
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box">
            <h1 className="title">Wheel of Challenges</h1>
            <p>
              Spin the wheel and test your skills against the challenge that you
              have been given.
            </p>
            <Wheel
              segmentGenerator={generator}
              initialSegmentCount={5}
              onDone={onDone}
              shouldStart={start}
              segmentComponent={segmentComponent}
              segmentWidth={150}
			  spinDuration={2000}
			  spinLengthMax={5000}
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
