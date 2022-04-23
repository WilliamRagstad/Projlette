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
  @Optional()
  approved?: boolean;
  @Optional()
  createdDate: Date;

  constructor(
    id: string | undefined = undefined,
    title: string,
    description: string,
    difficulty: Difficulty,
    tags: string[],
	author: string,
	approved: boolean = false,
	createdDate: Date | undefined = undefined
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.tags = tags;
	this.author = author;
	this.approved = approved;
	this.createdDate = createdDate ?? new Date();
  }
}
