import { Optional } from "https://deno.land/x/knight@2.3.0/mod.ts";

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Expert = "expert",
}

export default class Problem {
  @Optional()
  id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  author: string;

  constructor(
    id: string | undefined = undefined,
    title: string,
    description: string,
    difficulty: Difficulty,
    tags: string[],
	author: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.tags = tags;
	this.author = author;
  }
}
