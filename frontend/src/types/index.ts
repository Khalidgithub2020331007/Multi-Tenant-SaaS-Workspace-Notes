export type NoteStatus = "public" | "private" | "draft";

export interface Company {
  company_name: string;
  hostname: string;
  owner_name: string;
  owner_email: string;
  owner_password: string;
}
export interface NoteHistory {
  note_id: number;
  status_type: NoteStatus;
  note_title: string;
  note_content: string;
  author_user_id: number;
}

export interface NoteTag {
  note_id: number;
  tag_id: number;
}
export interface NoteVote {
  note_id: number;
  voter_user_id: number;
  vote_value: number;
}
export interface Note {
  title: string;
  content: string;
  note_type: NoteStatus;
  workspace_name: string;
  author_user_id: number;
  company_hostname: string;
  upvotes: number;
  downvotes: number;
}
export interface Tag {
  tag_name: string;
  company_owner_email: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  company_hostname: string;
  role: "member" | "owner";
}

export interface Workspace {
  id: number;
  workspace_name: string;
  company_hostname: string;
}
