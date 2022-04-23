import { Service } from "https://deno.land/x/knight@2.3.0/mod.ts";
import Problem from "../model/Problem.ts";

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
			result.push(this.problems[Math.floor(Math.random() * this.problems.length)]);
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
			throw new Error("New problem must not have an id");
		}
		// Generate a new id
		problem.id = this.generateProblemId();
		this.problems.push(problem);
		this.writeToLocalFile();
		return problem;
	}

	private randomFrom(list: string) {
		return list[Math.floor(Math.random() * list.length)];
	}

	private generateProblemId(): string {
		// A problem id starts with a letter, then two numbers and then a letter
		const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const numbers = "0123456789";
		const id = this.randomFrom(letters) + this.randomFrom(numbers) + this.randomFrom(numbers) + this.randomFrom(letters);
		if (this.getProblemById(id)) {
			// If the id already exists, generate a new one
			return this.generateProblemId();
		}
		return id;
	}
  },
);
