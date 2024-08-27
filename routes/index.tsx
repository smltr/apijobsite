import { Head } from "$fresh/runtime.ts";
import JobList from "../islands/JobList.tsx";
import Filter from "../islands/Filter.tsx";
import PostJob from "../islands/PostJob.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Jobby - Remote Dev Jobs</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div class="container">
        <header>
          <h1>jobby.dev</h1>
          <p>remote dev jobs</p>
          <PostJob />
        </header>
        <main>
          <Filter
            onFilter={(jobTypes) => {
              // You'll need to implement this to update the JobList
              console.log("Filter applied:", jobTypes);
            }}
          />
          <JobList filters={{ jobTypes: [] }} />
        </main>
        <footer>
          <a
            href="https://github.com/smltr/apijobsite"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/smltr/apijobsite
          </a>
        </footer>
      </div>
    </>
  );
}
