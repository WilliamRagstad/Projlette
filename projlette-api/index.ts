import { Knight } from "@knight/knight";
import LoggingService from "./service/LoggingService.ts";

Knight.start(Deno.env.get("PORT") || 8000, LoggingService.instance().logger);