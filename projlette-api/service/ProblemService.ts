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
  },
);
