import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = { id: Id<"channels">; name: string };
type ResponseType = Doc<"channels"> | null;

export const useUpdateChannel = () => {
  const mutation = useMutation(api.channels.update);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
