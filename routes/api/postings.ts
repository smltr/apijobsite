import { Handlers } from "$fresh/server.ts";
import { Posting, JobType } from "../../types/index.ts";
import { kv } from "../../db/kv.ts";
import { broadcast } from "./sse.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const jobTypes =
      (url.searchParams.get("jobTypes")?.split(",") as JobType[]) || [];
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const postings: Posting[] = [];
    for await (const entry of kv.list({ prefix: ["postings"] })) {
      const posting = entry.value as Posting;
      if (jobTypes.length === 0 || jobTypes.includes(posting.jobType)) {
        postings.push(posting);
      }
    }

    // Simple pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPostings = postings.slice(start, end);

    console.log("Fetched postings:", paginatedPostings);

    return new Response(JSON.stringify({ results: paginatedPostings }), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req) {
    const body = await req.json();
    const id = crypto.randomUUID();
    const posting: Posting = {
      id,
      title: body.title,
      company: body.company,
      salaryStart: body.salaryStart,
      salaryEnd: body.salaryEnd,
      jobType: body.jobType as JobType,
      country: body.country,
      postedDate: new Date().toISOString(),
      companyUrl: body.companyUrl,
      jobLink: body.jobLink,
    };

    await kv.set(["postings", id], posting);

    // Broadcast the new posting
    broadcast(posting);

    return new Response(JSON.stringify(posting), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },
};
