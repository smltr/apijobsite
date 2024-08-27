import { useState, useEffect } from "preact/hooks";
import JobItem from "../components/JobItem.tsx";
import { Posting, JobType } from "../types/index.ts";

interface JobListProps {
  filters: {
    jobTypes: JobType[];
  };
}

export default function JobList({ filters }: JobListProps) {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [newPostingIds, setNewPostingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPostings = async () => {
    setError(null);
    try {
      const response = await fetch(
        `/api/postings?${new URLSearchParams({
          jobTypes: filters.jobTypes.join(","),
          page: "1",
          limit: "20",
        })}`,
      );
      if (!response.ok) throw new Error("Failed to fetch postings");
      const data = await response.json();
      setPostings(data.results);
    } catch (err) {
      setError(`Failed to fetch postings: ${err}`);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");
    eventSource.onmessage = (event) => {
      if (event.data === "connected") {
        console.log("Connected to SSE");
        return;
      }
      const newPosting = JSON.parse(event.data);
      setPostings((prevPostings) => {
        // Check if the posting already exists
        if (!prevPostings.some((posting) => posting.id === newPosting.id)) {
          return [newPosting, ...prevPostings];
        }
        return prevPostings;
      });
      setNewPostingIds((prevIds) => [newPosting.id, ...prevIds]);

      // Remove highlighting after 5 seconds
      setTimeout(() => {
        setNewPostingIds((prevIds) =>
          prevIds.filter((id) => id !== newPosting.id),
        );
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div class="job-list">
      {postings.map((posting) => (
        <div key={posting.id} class="job-item-wrapper">
          <JobItem
            posting={posting}
            isNew={newPostingIds.includes(posting.id)}
            isPreview={false}
          />
        </div>
      ))}
    </div>
  );
}
