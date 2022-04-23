import { Service } from "https://deno.land/x/knight@2.3.0/mod.ts";
import { Solution, Solutions } from "../model/Solution.ts";
import { readFromLocalFile, writeToLocalFile } from "../util/fileSync.ts";

export default Service(
  class SolutionService {
    private solutionsFilepath = "./solutions.json";
    private awaitingSolutionsFilepath = "./awaiting-solutions.json";
    private solutions: Solutions = {};
    constructor() {
      // Load accepted solutions
      this.solutions = readFromLocalFile(this.solutionsFilepath);
    }

	public getSolutionsByProblemId(problemId: string) {
		return this.solutions[problemId];
	}

	public submitSolution(problemId: string, solution: Solution) {
		// Validate the fields
		if (!solution.githubUrl || !solution.githubUrl.match(/^https:\/\/github.com\/.+$/)) {
			throw "Github url is required and must be a valid github url";
		}
		if (!solution.author || solution.author.trim().length < 4) {
			throw "Author is required and must be at least 4 characters long";
		}
		solution.createdDate = new Date();
		// Add the solution to the file of awaiting solutions
		const awaiting: Solutions = readFromLocalFile(this.awaitingSolutionsFilepath);
		if (!awaiting[problemId]) {
			awaiting[problemId] = [];
		}
		awaiting[problemId].push(solution);
		// Save the new list of solutions
		writeToLocalFile(this.awaitingSolutionsFilepath, awaiting);
		return solution;
	}
  },
);
