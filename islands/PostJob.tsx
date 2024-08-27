import { useState } from "preact/hooks";
import JobItem from "../components/JobItem.tsx";
import { JobType, Posting } from "../types/index.ts";

export default function PostJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Posting>>({
    title: "",
    company: "",
    salaryStart: "",
    salaryEnd: "",
    jobType: JobType["FullStack"],
    country: "",
    jobLink: "",
    postedDate: new Date().toISOString(),
    companyUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: Event) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.company) newErrors.company = "Company is required";
    if (!formData.salaryStart)
      newErrors.salaryStart = "Salary start is required";
    if (!formData.salaryEnd) newErrors.salaryEnd = "Salary end is required";
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.jobLink) newErrors.jobLink = "Job link is required";
    if (!formData.companyUrl) newErrors.companyUrl = "Company URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("/api/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to post job");

      setIsOpen(false);
      setFormData({
        title: "",
        company: "",
        salaryStart: "",
        salaryEnd: "",
        jobType: JobType["FullStack"],
        country: "",
        jobLink: "",
        postedDate: new Date().toISOString(),
        companyUrl: "",
      });
      // You might want to add some feedback to the user here
    } catch (err) {
      console.error("Failed to post job:", err);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} class="post-job-button">
        Post a Job
      </button>
      {isOpen && (
        <div class="modal">
          <div class="modal-content">
            <h2>Post a New Job</h2>
            <JobItem
              posting={formData as Posting}
              isNew={false}
              isPreview={true}
            />
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span class="error">{errors.title}</span>}

              {/* Add similar input fields for other properties */}

              <button type="submit">Post Job</button>
            </form>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
