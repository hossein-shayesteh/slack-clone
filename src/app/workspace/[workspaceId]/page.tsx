"use client";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace(workspaceId);

  console.log(data);
  return <div>ID: {workspaceId}</div>;
};
export default WorkspaceIdPage;
