import { Posting, JobType } from "../types/index.ts";

interface JobItemProps {
  posting: Posting;
  isNew: boolean;
  isPreview: boolean;
}

export default function JobItem({ posting, isNew, isPreview }: JobItemProps) {
  return (
    <div class={`job-item ${isNew ? "job-item-new" : ""}`}>
      <div class="job-item-header">
        <img
          src={
            (posting.companyUrl.startsWith("http")
              ? posting.companyUrl
              : `https://${posting.companyUrl}`) + "/favicon.ico"
          }
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = "/default-favicon.ico";
          }}
          class="company-favicon"
          alt={`${posting.company} favicon`}
        />
        <div class="job-item-title">
          <a
            href={
              posting.jobLink.startsWith("http")
                ? posting.jobLink
                : `https://${posting.jobLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
            class="job-title-link"
          >
            {!isPreview ? posting.title : posting.title || "<job title>"}
          </a>
          <div class="job-item-subtitle">
            <span class="company-name">
              {!isPreview
                ? posting.company
                : posting.company || "<company name>"}
            </span>
            <span class="posted-date">
              {(() => {
                if (isPreview) return "Today";
                const postedDate = new Date(posting.postedDate);
                const today = new Date();
                const diffTime = today.getTime() - postedDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 0) return "Today";
                if (diffDays === 1) return "Yesterday";
                return `${diffDays} days ago`;
              })()}
            </span>
          </div>
        </div>
      </div>
      <div class="job-item-details">
        <span class="job-salary">{`${posting.salaryStart}-${posting.salaryEnd}k`}</span>
        <span class="job-type">
          {!isPreview ? posting.jobType : posting.jobType || "<job type>"}
        </span>
        <span class="job-location">
          {!isPreview ? posting.country : posting.country || "<location>"}
        </span>
      </div>
    </div>
  );
}
