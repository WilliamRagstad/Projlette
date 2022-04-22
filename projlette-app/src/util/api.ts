import { PRODUCTION_MODE } from "../index";

const endpoints = {
	dev: "http://localhost:8000/",
	prod: "https://api.projlette.com/",
}

export function apiFetch(path: string, options?: RequestInit): Promise<Response> {
	const url = (PRODUCTION_MODE ? endpoints.prod : endpoints.dev) + (path.startsWith("/") ? path.replace("/", "") : path);
	return fetch(url, options);
}
