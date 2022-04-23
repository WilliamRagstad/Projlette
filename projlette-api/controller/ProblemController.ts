import { Controller, IController, Context, ok, Endpoint, Params, bodyMappingJSON, badRequest } from "https://deno.land/x/knight@2.3.0/mod.ts";
import Problem from "../model/Problem.ts";
import ProblemService from "../service/ProblemService.ts";

@Controller("/problem")
export default class ProblemController extends IController {

	private problemService = ProblemService.instance();

	@Endpoint("GET", "/random/:count")
	randomProblems({ count }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.randomProblems(parseInt(count), false));
	}

	@Endpoint("GET", "/all")
	allProblems(_: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.allProblems(true));
	}

	@Endpoint("GET", "/all/:previews")
	allPreviewProblems({ previews }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.allProblems(previews.toLowerCase() === "true"));
	}

	@Endpoint("GET", "/:id")
	getProblemById({ id }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.getProblemById(id));
	}

	async post({ request, response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		let problem = await bodyMappingJSON(request, Problem);
		try {
			problem = this.problemService.addPreviewProblem(problem);
			console.log("Creating new preview of problem: ", problem);
			ok(response, problem);
		} catch (error) {
			console.error("Error creating problem: ", error);
			badRequest(response, error);
		}
	}
}
