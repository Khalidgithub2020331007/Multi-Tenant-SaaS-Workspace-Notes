import api from "./axios";

export type CreateWorkspacePayload = {
  workspace_name: string;
  company_hostname: string;
};

export const createWorkspace = (payload: CreateWorkspacePayload) => {
  return api.post("/workspace/create", payload);
};
