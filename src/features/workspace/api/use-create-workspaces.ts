import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { name: string };
type ResponseType = Doc<"workspaces"> | null;

export const useCreateWorkspaces = () => {
  const mutation = useMutation(api.workspaces.create);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
