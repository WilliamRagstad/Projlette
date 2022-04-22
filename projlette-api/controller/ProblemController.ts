import { Controller, IController, Context, ok, Endpoint, Params } from "https://deno.land/x/knight@2.3.0/mod.ts";

@Controller("/api/problem")
export default class ProblemController extends IController {
	get({ response }: Context) {
		ok(response, {
			message: "Hello World"
		});
	}

	@Endpoint("GET", "/random/:count")
	randomProblems({ count }: Params, { response }: Context) {
		response.headers.append("Access-Control-Allow-Origin", "*"); // Allow CORS
		// const problems = await this.problemService.getRandomProblems(count);
		const problems = [
			{
			  id: "A12X",
			  title: "Simple TODO app",
			  description: "Write a simple todo application",
			  difficulty: "easy",
			  tags: ["react", "typescript", "node", "console"],
			},
			{
			  id: "E7C",
			  title: "Pong game",
			  description: "Write the famous pong game",
			  difficulty: "medium",
			  tags: ["game", "old school", "console", "web"],
			},
			{
			  id: "P42K",
			  title: "Tic Tac Toe",
			  description: "Write the famous tic tac toe game",
			  difficulty: "hard",
			  tags: ["game", "old school", "console", "web"],
			},
			{
			  id: "H3T",
			  title: "The Calculator",
			  description:
				"Write a simple calculator application that can compute basic arithmetic",
			  difficulty: "medium",
			  tags: ["language", "evaluate"],
			},
			{
			  id: "G1L",
			  title: "Movie Database",
			  description:
				"Write a database for movies, with search, add, and delete functionality",
			  difficulty: "medium",
			  tags: ["database", "search", "add", "delete"],
			},
			{
			  id: "F7Z",
			  title: "Chess AI",
			  description: "Write a chess AI that can play against itself and a human",
			  difficulty: "hard",
			  tags: ["ai", "chess", "game"],
			},
			{
			  id: "B1X",
			  title: "Emoji Translator",
			  description: "Write a translator app that converts text to emoji",
			  difficulty: "easy",
			  tags: ["language", "emoji", "translate"],
			},
			{
			  id: "D9M",
			  title: "Vending Machine",
			  description:
				"Write a vending machine that can dispense and display different items",
			  difficulty: "medium",
			  tags: ["display", "interface"],
			},
		  ];
		const result = [];
		for (let i = 0; i < parseInt(count); i++) {
			result.push(problems[Math.floor(Math.random() * problems.length)]);
		}
		ok(response, result);
	}
}
