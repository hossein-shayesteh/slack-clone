interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage = ({ params: { workspaceId } }: WorkspaceIdPageProps) => {
  return <div>ID: {workspaceId}</div>;
};
export default WorkspaceIdPage;
