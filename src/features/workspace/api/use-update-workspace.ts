import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { id: Id<"workspaces">; name: string };
type ResponseType = Doc<"workspaces"> | null;

export const useUpdateWorkspace = () => {
  const mutation = useMutation(api.workspaces.update);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
