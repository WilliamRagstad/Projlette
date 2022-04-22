import * as React from "react";
import { useEffect } from "react";
import { apiFetch } from "../../util/api";

export default function AllChallenges() {
  const [challenges, setChallenges] = React.useState([]);
  useEffect(() => {
    apiFetch("/problem/all/")
      .then((res) => res.json())
      .then(setChallenges);
  }, []);

  const tagColors = [
    "#EE4040",
    "#d3a83c",
    "#815CD1",
    "#3DA5E0",
    "#20a741",
    "#F9AA1F",
  ];

  const difficultyColors = {
    easy: "#188533",
    medium: "#c19f0c",
    hard: "#a12121",
    expert: "#ad1aa8",
  };

  const getTagColor = (tag: string) => {
    const sum = tag.split("").reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
    const hash = (sum * tag.length) / 2;
    return tagColors[hash % tagColors.length];
  };

  return (
    <div id="all">
      <div className="block">
        <h1 className="title">All Challenges</h1>
        <h2 className="subtitle">
          View all available programming challenges here. Sort by difficulty,
          category, or by date. You can also submit your own challenge by
          clicking the "Submit Challenge" tab above.
        </h2>
      </div>
      <table className="table is-bordered is-fullwidth is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
			<th>Author</th>
            <th>Difficulty</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => (
            <tr key={challenge.id}>
              <td><em>{challenge.id}</em></td>
              <td><b>{challenge.title}</b></td>
              <td>{challenge.description}</td>
			  <td>{challenge.author}</td>
              <td>
                <span
                  style={{
                    color: difficultyColors[challenge.difficulty],
                  }}
                >
                  {challenge.difficulty[0].toUpperCase() + challenge.difficulty.slice(1)}
                </span>
              </td>
              <td>
                <div className="tags">
                  {challenge.tags.map((tag) => (
                    <span
                      className="tag is-primary"
                      key={tag}
                      style={{ backgroundColor: getTagColor(tag) }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
