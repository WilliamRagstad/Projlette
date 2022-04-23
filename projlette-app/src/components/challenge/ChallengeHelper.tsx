import * as React from "react";

export function challengeColor(id: string) {
  const colors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
  ];
  return colors[id.charCodeAt(0) % colors.length];
}

const difficultyColors = {
  easy: "#188533",
  medium: "#c19f0c",
  hard: "#a12121",
  expert: "#ad1aa8",
};

const tagColors = [
  "#EE4040",
  "#d3a83c",
  "#815CD1",
  "#3DA5E0",
  "#20a741",
  "#F9AA1F",
  "#34A24F",
  "#ad1aa8",
  "#a12121",
  "#c19f0c",
  "#188533",
  "#ad1aa8",
  "#a12121",
];

export function getDifficultyColor(difficulty: string) {
	  return difficultyColors[difficulty.toLowerCase()];
};

export function getTagColor(tag: string) {
  const sum = tag.split("").reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
  const hash = (sum * tag.length) / 2;
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
