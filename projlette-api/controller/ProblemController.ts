import { Controller, IController, Context, ok, Endpoint, Params, bodyMappingJSON } from "https://deno.land/x/knight@2.3.0/mod.ts";
import Problem from "../model/Problem.ts";
import ProblemService from "../service/ProblemService.ts";

@Controller("/problem")
export default class ProblemController extends IController {

	private problemService = ProblemService.instance();

	@Endpoint("GET", "/random/:count")
	randomProblems({ count }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.randomProblems(parseInt(count)));
	}

	@Endpoint("GET", "/all")
	allProblems(_: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.allProblems());
	}

	@Endpoint("GET", "/:id")
	getProblemById({ id }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.getProblemById(id));
	}

	async post({ request, response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		const problem = await bodyMappingJSON(request, Problem);
		ok(response, this.problemService.addProblem(problem));
	}
}
