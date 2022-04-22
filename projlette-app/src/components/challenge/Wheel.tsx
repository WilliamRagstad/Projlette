import * as React from "react";
import { useEffect, useState } from "react";
import "./Wheel.css";

export default function Wheel<T>({
	segmentGenerator,
	initialSegmentCount,
	onDone,
	shouldStart,
	segmentComponent,
	segmentWidth,
  }: {
	segmentGenerator: (count) => T[];
	initialSegmentCount: number;
	onDone: (winner: T) => void;
	shouldStart: boolean;
	segmentComponent: (segment: T, index: number) => JSX.Element;
	segmentWidth: number;
  }) {
	const [spinning, setSpinning] = useState(false);
	const [prevOffset, setPrevOffset] = useState(0);
	const [segments, setSegments] = useState<T[]>(
	  segmentGenerator(initialSegmentCount)
	);

	const wheelDiv = () => document.getElementById("wheel-generate");
	const segmentsDiv = () => wheelDiv().childNodes[0] as HTMLDivElement;
	const setOffset = (offset: number) =>
	  (segmentsDiv().style.transform = `translateX(-${offset}px)`);
	const getSelectedSegment = () => {
	  const br = wheelDiv().getBoundingClientRect();
	  const elms = document.elementsFromPoint(
		br.left + br.width / 2,
		br.top + br.height / 2
	  );
	  for (const e of elms) {
		if (e.classList.contains("segment")) {
		  return e;
		}
	  }
	  return undefined;
	};
	const preloadSegments = (count) => {
		const newSegments = [...segments, ...segmentGenerator(count)];
		setSegments(newSegments);
		return newSegments;
	}
	const doSpin = () => {
	  if (spinning) return;
	  setSpinning(true);

	  const nextOffset = prevOffset + Math.random() * 1000 + 500;
	  // debugger;
	  const passingSegments = (nextOffset - prevOffset) / segmentWidth;
	  console.log("Passing segments: ", passingSegments);
	  const newSegments = preloadSegments(Math.floor(passingSegments));
	  setOffset(nextOffset);

	  setTimeout(() => {
		setPrevOffset(nextOffset);
		setSpinning(false);
		const selected = getSelectedSegment();
		if (selected === undefined) {
		  throw new Error("No segment selected");
		}
		const index = parseInt(selected.getAttribute("data-index"));
		onDone(newSegments[index]);
	  }, 1000);
	};

	if (shouldStart) doSpin();
	//   for (let i = 0; i < 1; i++) {
	//     segmentIterator.next();
	//   }

	return (
	  <div id="wheel-generate" className="wheel">
		<div className="segments">
		  {segments.map((segment, index) => (
			<div className="segment" key={index} data-index={index}>
			  {segmentComponent(segment, index)}
			</div>
		  ))}
		</div>
		<div className="arrow"></div>
	  </div>
	);
  }
