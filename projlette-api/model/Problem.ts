export enum Difficulty {
	  Easy = "easy",
	  Medium = "medium",
	  Hard = "hard",
	  Expert = "expert",
}

export default class Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    difficulty: Difficulty,
	tags: string[],
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
	this.tags = tags;
  }
}
