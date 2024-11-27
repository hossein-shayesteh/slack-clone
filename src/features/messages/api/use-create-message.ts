import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = {
  body: string;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage">;
  channelId?: Id<"channels">;
  parentMessage?: Id<"messages">;
};
type ResponseType = Doc<"messages"> | null;

export const useCreateMessage = () => {
  const mutation = useMutation(api.messages.create);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
