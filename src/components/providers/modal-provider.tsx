"use client";

import { useEffect, useState } from "react";

import CreateChannelModal from "@/src/features/channels/components/create-channel-modal";
import CreateWorkspaceModal from "@/src/features/workspace/components/create-workspace-modal";
import WorkspacePreferencesModal from "@/src/features/workspace/components/workspace-preferences-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Render CardModal only when component is mounted to prevent hydration errors
  if (!isMounted) return null;

  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
      <WorkspacePreferencesModal />
    </>
  );
};
export default ModalProvider;
