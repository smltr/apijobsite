export enum JobType {
  FullStack = "Full Stack",
  FrontEnd = "Front End",
  BackEnd = "Back End",
  DevOps = "DevOps",
  Data = "Data",
  AI = "AI",
}

export interface Posting {
  id: string;
  title: string;
  company: string;
  salaryStart: string;
  salaryEnd: string;
  jobType: JobType;
  country: string;
  postedDate: string;
  companyUrl: string;
  jobLink: string;
}
