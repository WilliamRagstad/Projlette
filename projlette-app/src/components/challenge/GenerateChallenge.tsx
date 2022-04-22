import * as React from "react";
import { useEffect, useState } from "react";
import PreloadingIterator from "./PreloadingIterator";
import "./wheel.css";

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
  const onDone = (winner) => {
    console.log("The winner is: ", winner);
  };

  let generatorIndex = 0;
  const generator = (count) => {
    // TODO: Fetch the data from the API
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(segments[generatorIndex++ % segments.length]);
    }
    return result;
  };
  const iterator = new PreloadingIterator(generator, 5);
  iterator.preloadCache();
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
  const startState = useState(false);
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
              segmentIterator={iterator}
              onDone={onDone}
              start={startState}
              segmentComponent={segmentComponent}
			  segmentWidth={150}
            />
            <div className="buttons is-centered">
              <button
                className={"button is-success is-large is-fullwidth is-rounded " +
                  (startState[0] ? "is-loading" : "")}
                onClick={() => startState[1](true)}
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

function Wheel<T>({
  segmentIterator,
  onDone,
  start,
  segmentComponent,
  segmentWidth,
}: {
  segmentIterator: PreloadingIterator<T>;
  onDone: (winner: T) => void;
  start: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  segmentComponent: (segment: T, index: number) => JSX.Element;
  segmentWidth: number;
}) {
  const [spinning, setSpinning] = useState(false);
  const [prevOffset, setPrevOffset] = useState(0);
  const [segments, setSegments] = useState<T[]>([]);

  const wheelDiv = () => document.getElementById("wheel-generate");
  const segmentsDiv = () => wheelDiv().childNodes[0] as HTMLDivElement;
  const setOffset = (offset: number) =>
    segmentsDiv().style.transform = `translateX(-${offset}px)`;
  const getSelectedSegment = () => {
    const br = wheelDiv().getBoundingClientRect();
    const elms = document.elementsFromPoint(
      br.left + br.width / 2,
      br.top + br.height / 2,
    );
    for (const e of elms) {
      if (e.classList.contains("segment")) {
        return e;
      }
    }
    return undefined;
  };
  const doSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const nextOffset = prevOffset + Math.random() * 1000 + 500;
	debugger;
	const passingSegments = (nextOffset - prevOffset) / segmentWidth;
	console.log("Passing segments: ", passingSegments);
	for (let i = 0; i < passingSegments; i++) {
		segmentIterator.next();
	}
    setOffset(nextOffset);

    setTimeout(() => {
      setPrevOffset(nextOffset);
      setSpinning(false);
      start[1](false);
	  const selected = getSelectedSegment();
	  if (selected === undefined) {
		  throw new Error("No segment selected");
	  }
	  debugger
	  const index = parseInt(selected.getAttribute("data-index"));
	  onDone(segments[index]);
    }, 1000);
  };

  if (start[0]) {
	  doSpin();
	}
//   for (let i = 0; i < 1; i++) {
//     segmentIterator.next();
//   }

  return (
    <div id="wheel-generate" className="wheel">
      <div className="segments">
        {segmentIterator.map((segment, index) => (
          <div className="segment" key={index}>
            {segmentComponent(segment, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
