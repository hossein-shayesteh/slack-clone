import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { name: string; workspaceId: Id<"workspaces"> };
type ResponseType = Doc<"channels"> | null;

export const useCreateChannel = () => {
  const mutation = useMutation(api.channels.create);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
