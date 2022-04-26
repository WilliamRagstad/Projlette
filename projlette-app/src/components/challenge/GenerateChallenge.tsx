import * as React from "react";
import { useEffect, useState } from "react";
import { challengeColor } from "./ChallengeHelper";
import Wheel from "./Wheel";
import ProblemBox from "./ProblemBox";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { setProp } from "../../util/firebase";

export default function GenerateChallenge() {
  const [allChallenges, setAllChallenges] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    getDocs(collection(db, "problems")).then((snap) =>
      setAllChallenges(
        snap.docs.map((d) => setProp(d.data(), { id: d.id, approved: true }))
      )
    );
  }, []);

  const generator = async (count) => {
    if (allChallenges.length === 0) {
      return null;
    }

    // Select random problems from all challenges
    const selected = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * allChallenges.length);
      if (
        count <= allChallenges.length &&
        selected.find((s) => s.id === allChallenges[index].id)
      ) {
        i--;
      } else {
        selected.push(allChallenges[index]);
      }
    }
    return selected;
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
			  segmentGeneratorReady={allChallenges.length > 0}
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
