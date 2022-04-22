import { Controller, IController, Context, ok, Endpoint, Params } from "https://deno.land/x/knight@2.3.0/mod.ts";
import ProblemService from "../service/ProblemService.ts";

@Controller("/problem")
export default class ProblemController extends IController {

	private problemService = ProblemService.instance();

	get({ response }: Context) {
		ok(response, {
			message: "Hello World"
		});
	}

	@Endpoint("GET", "/random/:count")
	randomProblems({ count }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.randomProblems(parseInt(count)));
	}

	@Endpoint("GET", "/all")
	allProblems({ response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		ok(response, this.problemService.allProblems());
	}
}
