import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type ResponseType = Doc<"channels"> | null;
type RequestType = {
  name: string;
  workspaceId: Id<"workspaces">;
};

export const useCreateChannel = () => {
  const mutation = useMutation(api.channels.create);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
