import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { id: Id<"workspaces">; joinCode: string };
type ResponseType = Doc<"workspaces"> | null;

export const useJoinWorkspace = () => {
  const mutation = useMutation(api.workspaces.join);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
