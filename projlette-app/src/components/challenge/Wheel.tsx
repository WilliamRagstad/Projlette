import * as React from "react";
import { useEffect, useState } from "react";
import "./Wheel.css";

export default function Wheel<T>({
	segmentGenerator,
	initialSegmentCount,
	onDone,
	onFail,
	shouldStart,
	segmentComponent,
	segmentWidth,
	wheelMaxWidth = initialSegmentCount * segmentWidth,
	spinDuration = 1000,
	spinLengthMin = 500,
	spinLengthMax = 1500,
  }: {
	segmentGenerator: (count) => Promise<T[]>;
	initialSegmentCount: number;
	onDone: (winner: T, index?: number) => void;
	onFail: (msg: string) => void;
	shouldStart: boolean;
	segmentComponent: (segment: T, index: number) => JSX.Element;
	segmentWidth: number;
	wheelMaxWidth?: number;
	spinDuration?: number;
	spinLengthMin?: number;
	spinLengthMax?: number;
  }) {
	const [spinning, setSpinning] = useState(false);
	const [prevOffset, setPrevOffset] = useState(0);
	const [segments, setSegments] = useState<T[]>([]);
	const [segmentsPromise, setSegmentsPromise] = useState(null);

	const preloadSegments = (count) => {
		if (count > 0 && !segmentsPromise) {
			setSegmentsPromise(segmentGenerator(count));
		}
	}

	// Initial preload of first set of segments
	useEffect(() => {
		preloadSegments(initialSegmentCount);
	}, []);

	// Handle promise when new segments are fetched
	useEffect(() => {
		if (segmentsPromise) {
			segmentsPromise.then((newSegments) => {
				console.log("New segments: ", newSegments);
				setSegments([...segments, ...newSegments]);
				setSegmentsPromise(null);
			});
		}
	}, [segmentsPromise]);

	const wheelDiv = () => document.getElementById("wheel-generate");
	const segmentsDiv = () => wheelDiv().childNodes[0] as HTMLDivElement;
	const setOffset = (offset: number) =>
	  (segmentsDiv().style.transform = `translateX(-${offset}px)`);
	const selectedSegment = () => {
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
	const getSegments = () => segments;
	const doSpin = () => {
	  if (spinning) return;
	  setSpinning(true);

	  const nextOffset = prevOffset + Math.random() * (spinLengthMax - spinLengthMin) + spinLengthMin;
	  const passingSegments = (nextOffset - prevOffset) / segmentWidth;
	  console.log("Passing segments: ", passingSegments);
	  preloadSegments(Math.floor(passingSegments));
	  setOffset(nextOffset);

	  setTimeout(() => {
		setPrevOffset(nextOffset);
		setSpinning(false);

		const selected = selectedSegment();
		if (selected === undefined) {
			onFail("No segment selected");
			return;
		}
		const index = parseInt(selected.getAttribute("data-index"));
		if (index === undefined || segments[index] === undefined) {
			onFail("index or the segment at the index is undefined");
			return;
		}
		onDone(segments[index], index);
	  }, spinDuration);
	};

	if (shouldStart && !spinning) {
		doSpin();
	}
	//   for (let i = 0; i < 1; i++) {
	//     segmentIterator.next();
	//   }

	// Set spin duration CSS variable
	useEffect(() => {
		wheelDiv().style.setProperty("--spin-duration", `${spinDuration}ms`);
	}, [spinDuration]);

	return (
	  <div id="wheel-generate" className="wheel" style={{
		  maxWidth: wheelMaxWidth,
	  }}>
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
