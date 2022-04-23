import { Service } from "https://deno.land/x/knight@2.3.0/mod.ts";
import Problem, { Difficulty } from "../model/Problem.ts";

export default Service(
  class ProblemService {
    // The local file that contains all problems
    private filepath = "./problems.json";
    private problems: Problem[];
    constructor() {
      this.problems = this.readFromLocalFile();
    }

    private readFromLocalFile() {
      const file = Deno.readFileSync(this.filepath);
      const data = new TextDecoder("utf-8").decode(file);
      return JSON.parse(data);
    }

    private writeToLocalFile() {
      const data = JSON.stringify(this.problems);
      Deno.writeFileSync(this.filepath, new TextEncoder().encode(data));
    }

    public randomProblems(count: number) {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(
          this.problems[Math.floor(Math.random() * this.problems.length)],
        );
      }
      return result;
    }

    public allProblems() {
      return this.problems;
    }

    public getProblemById(id: string) {
      return this.problems.find((problem) => problem.id === id);
    }

    public addProblem(problem: Problem) {
      // Check so that the problem doesn't have an id
      if (problem.id) {
        throw "New problem must NOT already have an id";
      }
      // Validate the fields
      if (!problem.title || problem.title.trim().length < 4) {
        throw "Title is required and must be at least 4 characters long";
      }
      if (!problem.description || problem.description.trim().length < 10) {
        throw "Description is required and must be at least 10 characters long";
      }
      if (!problem.difficulty || problem.difficulty.trim().length === 0) {
        throw "Difficulty is required";
      }
      if (!problem.tags || problem.tags.length === 0) {
        throw "At least one tag is required";
      }
      if (!problem.author || problem.author.trim().length < 4) {
        throw "Author is required and the name must be at least 4 characters long";
      }
      // Format fields
      problem.title = this.stripSpecialCharacters(problem.title.trim().split(" ").map(
        this.capitalizeFirstLetterInWord,
      ).join(" ").replaceAll(". ", ""));
      problem.description = this.stripSpecialCharacters(problem.description.trim());
      if (!problem.description.endsWith(".")) {
        problem.description += ".";
      }
	  const difficulty = this.capitalizeFirstLetterInWord(problem.difficulty.trim().toLowerCase());
	  if (Object.keys(Difficulty).indexOf(difficulty) === -1) {
		throw "Difficulty must be one of the following: easy, medium, hard or expert";
	  }
	  problem.difficulty = difficulty as Difficulty;
	  problem.tags = problem.tags.map(t => this.stripSpecialCharacters(t.toLowerCase()));
	  problem.author = this.capitalizeFirstLetterInWord(this.stripSpecialCharacters(problem.author.trim()));
      // Generate a new id
      problem.id = this.generateProblemId();
      this.problems.push(problem);
      this.writeToLocalFile();
      return problem;
    }

    private capitalizeFirstLetterInWord(word: string) {
      return word[0].toUpperCase() + word.slice(1);
    }

	private stripSpecialCharacters(str: string) {
		return str.replace(/[^a-zA-Z0-9\s\-\.\,\&\?\:]/g, "");
	}

    private randomFrom(list: string) {
      return list[Math.floor(Math.random() * list.length)];
    }

    private generateProblemId(): string {
      // A problem id starts with a letter, then two numbers and then a letter
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      const id = this.randomFrom(letters) + this.randomFrom(numbers) +
        this.randomFrom(numbers) + this.randomFrom(letters);
      if (this.getProblemById(id)) {
        // If the id already exists, generate a new one
        return this.generateProblemId();
      }
      return id;
    }
  },
);
