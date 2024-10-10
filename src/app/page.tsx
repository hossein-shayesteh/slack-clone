"use client";

import { useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import UserButton from "@/src/features/auth/components/user-button";
import { useGetWorkspaces } from "@/src/features/workspace/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/src/features/workspace/store/use-create-workspace-modal";

const Home = () => {
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else {
      // Open create workspace modal
      setOpen(true);
    }
  }, [workspaceId, isLoading, setOpen, router]);

  return (
    <div>
      Home
      <UserButton />
    </div>
  );
};
export default Home;
