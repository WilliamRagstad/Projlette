import * as React from "react";
import { useEffect } from "react";
import { apiFetch } from "../../util/api";
import { getDifficultyColor, renderTags } from "./ChallengeHelper";

export default function AllChallenges() {
  const [challenges, setChallenges] = React.useState([]);
  const [filteredChallenges, setFilteredChallenges] = React.useState([]);
  useEffect(() => {
    apiFetch("/problem/all/")
      .then((res) => res.json())
      .then(setChallenges);
  }, []);

  useEffect(() => {
    setFilteredChallenges(challenges);
  }, [challenges]);

  const onSearch = () => {
    // Filter through the challenges and update filteredChallenges
	const text = (document.getElementById("search-text") as HTMLInputElement).value;
	const difficulty = (document.getElementById("search-difficulty") as HTMLSelectElement).selectedOptions[0].value;
	console.log(text, difficulty);

	setFilteredChallenges(challenges.filter((challenge) => {
		return challenge.title.toLowerCase().includes(text.toLowerCase());
	}));
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

      <div className="block">
        <h2 className="title is-4">Filter</h2>
        <p className="subtitle is-5">
          Search by <em>id</em>, <em>title</em>, <em>description</em>,{" "}
          <em>author</em> or <em>tags</em>.
        </p>

        <div className="field has-addons">
          <div className="control has-icons-left">
            <div className="select">
              <select id="search-difficulty" onSelect={onSearch} defaultValue="Easy peazy">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
                <option>Expert</option>
              </select>
            </div>
            <div className="icon is-small is-left">
              <i className="fas fa-dumbbell"></i>
              {/* <i className="fas fa-fist-raised"></i> */}
            </div>
          </div>
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Find a challenge"
			  id="search-text"
            />
          </div>
          <div className="control">
            <a className="button is-info" onClick={onSearch}>Search</a>
          </div>
        </div>
      </div>

      <table className="table is-bordered is-fullwidth is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Author</th>
            <th>Approved</th>
            <th>Difficulty</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredChallenges.map((challenge) => (
            <tr key={challenge.id}>
              <td>
                <a href={"/problem/" + challenge.id}>
                  <em>{challenge.id}</em>
                </a>
              </td>
              <td>
                <a href={"/problem/" + challenge.id}>
                  <b>{challenge.title}</b>
                </a>
              </td>
              <td>{challenge.description}</td>
              <td>{challenge.author}</td>
              <td>{challenge.approved ? "Yes" : "No"}</td>
              <td>
                <span
                  style={{
                    color: getDifficultyColor(challenge.difficulty),
                  }}
                >
                  {challenge.difficulty[0].toUpperCase() +
                    challenge.difficulty.slice(1)}
                </span>
              </td>
              <td>{renderTags(challenge.tags)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
