import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { id: Id<"channels"> };
type ResponseType = Doc<"channels"> | null;

export const useRemoveChannel = () => {
  const mutation = useMutation(api.channels.remove);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
