import * as React from "react";
import { useEffect } from "react";
import { apiFetch } from "../../util/api";
import {
  challengeColor,
  renderApproved,
  renderDifficulty,
  renderTags,
} from "./ChallengeHelper";

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
    const text = (
      document.getElementById("search-text") as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();
    let textParts = text.length > 0 ? text.split(" ") : [];
    const difficulty = (
      document.getElementById("search-difficulty") as HTMLSelectElement
    ).selectedOptions[0].value.toLowerCase();

    const maxScore = 6; // nr of aspects to search for
    const searchBuckets = [...Array(maxScore + 1)].map((a) => []);
    const searchResults = challenges.reduce((acc: any[][], challenge) => {
      let score = maxScore;
      if (textParts.some((tp) => challenge.id.toLowerCase().includes(tp))) {
        score--;
      }
      if (textParts.some((tp) => challenge.title.toLowerCase().includes(tp))) {
        score--;
      }
      if (
        textParts.some((tp) => challenge.description.toLowerCase().includes(tp))
      ) {
        score--;
      }
      if (textParts.some((tp) => challenge.author.toLowerCase().includes(tp))) {
        score--;
      }
      if (
        difficulty !== "any" &&
        challenge.difficulty.toLowerCase().includes(difficulty)
      ) {
        score--;
      }
      challenge.tags.forEach((tag) => {
        if (
          textParts.some((tp) => tag.toLowerCase().includes(tp)) &&
          score > 0
        ) {
          score--;
        }
      });
      acc[score].push(challenge);
      return acc;
    }, searchBuckets);
    setFilteredChallenges(searchResults.flat());
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
              <select
                id="search-difficulty"
                onChange={onSearch}
                defaultValue="Easy peazy"
              >
                <option>Any</option>
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
              onKeyUp={onSearch}
            />
          </div>
          <div className="control">
            <a className="button is-info" onClick={onSearch}>
              Search
            </a>
          </div>
        </div>
      </div>
      <div className="overflow-x-scroll">
        <table className="table is-bordered is-fullwidth is-striped is-narrow is-hoverable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Author</th>
              <th>
                <abbr title="Is Approved">A</abbr>
              </th>
              <th>Difficulty</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredChallenges.map((challenge) => (
              <tr key={challenge.id}>
                <td className="has-text-centered">
                  <a href={"/problem/" + challenge.id}>
                    <span style={{ color: challengeColor(challenge.id) }}>
                      {challenge.id}
                    </span>
                  </a>
                </td>
                <td>
                  <a href={"/problem/" + challenge.id}>
                    <b>{challenge.title}</b>
                  </a>
                </td>
                <td>
                  <span className="max-three-lines">
                    {challenge.description}
                  </span>
                </td>
                <td>
                  <em>{challenge.author}</em>
                </td>
                <td className="has-text-centered">
                  {renderApproved(challenge.approved)}
                </td>
                <td>{renderDifficulty(challenge.difficulty)}</td>
                <td>{renderTags(challenge.tags)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
