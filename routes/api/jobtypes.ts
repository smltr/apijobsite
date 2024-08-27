import { Handlers } from "$fresh/server.ts";
import { JobType } from "../../types/index.ts";

export const handler: Handlers = {
  GET(_req) {
    const jobTypes = Object.values(JobType);
    return new Response(JSON.stringify(jobTypes), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
