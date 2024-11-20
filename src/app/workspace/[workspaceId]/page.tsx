"use client";

import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  return <div>ID: {workspaceId}</div>;
};
export default WorkspaceIdPage;
