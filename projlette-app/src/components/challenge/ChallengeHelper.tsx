import * as React from "react";

export function challengeColor(id: string) {
  const idColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
  ];
  return idColors[id.charCodeAt(0) % idColors.length];
}

const difficultyColors = {
  easy: "#188533",
  medium: "#c19f0c",
  hard: "#a12121",
  expert: "#ad1aa8",
};

const tagColors = [
  "#EE4040",
  "#815CD1",
  "#3DA5E0",
  "#20a741",
  "#F9AA1F",
  "#ad1aa8",
];

export function getDifficultyColor(difficulty: string) {
	  return difficultyColors[difficulty.toLowerCase()];
};

export function getTagColor(tag: string) {
  const sum = tag.split("").reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
  const hash = (sum * tag.length);
  return tagColors[hash % tagColors.length];
};

export function renderTags(tags: string[]) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <span
          className="tag is-primary"
          key={tag}
          style={{ backgroundColor: getTagColor(tag) }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
