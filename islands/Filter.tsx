import { useState, useEffect } from "preact/hooks";

interface FilterProps {
  onFilter: (jobTypes: string[]) => void;
}

export default function Filter({ onFilter }: FilterProps) {
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchJobTypes() {
      try {
        const response = await fetch("/api/jobtypes");
        if (!response.ok) throw new Error("Failed to fetch job types");
        const data = await response.json();
        setJobTypes(data);
      } catch (error) {
        console.error("Failed to fetch job types:", error);
      }
    }
    fetchJobTypes();
  }, []);

  const handleJobTypeToggle = (jobType: string) => {
    setSelectedJobTypes((prev) => {
      const newJobTypes = prev.includes(jobType)
        ? prev.filter((type) => type !== jobType)
        : [...prev, jobType];

      onFilter(newJobTypes);
      return newJobTypes;
    });
  };

  return (
    <div class="filter">
      {jobTypes.map((jobType) => (
        <button
          key={jobType}
          onClick={() => handleJobTypeToggle(jobType)}
          class={`filter-chip ${selectedJobTypes.includes(jobType) ? "filter-chip-selected" : ""}`}
        >
          {jobType}
        </button>
      ))}
    </div>
  );
}
