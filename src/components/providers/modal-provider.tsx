"use client";

import { useEffect, useState } from "react";

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
      <CreateWorkspaceModal />
      <WorkspacePreferencesModal />
    </>
  );
};
export default ModalProvider;
