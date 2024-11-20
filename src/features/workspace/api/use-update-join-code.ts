import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { id: Id<"workspaces"> };
type ResponseType = Doc<"workspaces"> | null;

export const useUpdateJoinCode = () => {
  const mutation = useMutation(api.workspaces.updateJoinCode);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
