import {
  badRequest,
  bodyMappingJSON,
  type Context,
  Controller,
  Endpoint,
  IController,
  ok,
  type Params,
} from "@knight/knight"; // "https://deno.land/x/knight@2.3.0/mod.ts";
import { Solution } from "../model/Solution.ts";
import ProblemService from "../service/ProblemService.ts";
import SolutionService from "../service/SolutionService.ts";

@Controller("/solutions")
export default class SolutionController extends IController {
  private solutionService = SolutionService.instance();
  private problemService = ProblemService.instance();

  @Endpoint("GET", "/:id")
  getSolutionsByProblemId({ id }: Params, { response }: Context) {
    response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
    const solutions = this.solutionService.getSolutionsByProblemId(id);
    if (solutions) ok(response, solutions);
    else ok(response, []);
  }

  @Endpoint("POST", "/:id")
  async postSolution({ id }: Params, { request, response }: Context) {
    response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
	// Check if there is a problem with the given id
	// Throws an error if problem does not exist
	this.problemService.getProblemById(id);

    let solution = await bodyMappingJSON(request, Solution);
    try {
      solution = await this.solutionService.submitSolution(id, solution);
      console.log("Adding solution to problem", id, solution);
      ok(response, solution);
    } catch (error) {
      console.error("Error adding solution: ", error);
      badRequest(response, error as string);
    }
  }
}
