import { kv } from "../db/kv.ts";
import { Posting, JobType } from "../types/index.ts";

const samplePostings: Posting[] = [
  {
    id: crypto.randomUUID(),
    title: "Senior Frontend Developer",
    company: "TechCorp",
    salaryStart: "100",
    salaryEnd: "150",
    jobType: JobType.FrontEnd,
    country: "USA",
    postedDate: new Date().toISOString(),
    companyUrl: "https://techcorp.com",
    jobLink: "https://techcorp.com/jobs/senior-frontend",
  },
  {
    id: crypto.randomUUID(),
    title: "Backend Engineer",
    company: "DataSys",
    salaryStart: "90",
    salaryEnd: "130",
    jobType: JobType.BackEnd,
    country: "Canada",
    postedDate: new Date().toISOString(),
    companyUrl: "https://datasys.com",
    jobLink: "https://datasys.com/careers/backend-engineer",
  },
  // Add more sample postings as needed
];

export async function seedDatabase() {
  console.log("Seeding database...");
  for (const posting of samplePostings) {
    await kv.set(["postings", posting.id], posting);
  }
  console.log("Database seeded successfully.");
}

if (import.meta.main) {
  await seedDatabase();
  Deno.exit(0);
}
