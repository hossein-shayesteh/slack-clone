import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { useConvexMutation } from "@/src/hooks/use-convex-mutation";

type RequestType = undefined;
type ResponseType = string;

export const useGenerateUploadUrl = () => {
  const mutation = useMutation(api.upload.generateUploadUrl);

  return useConvexMutation<RequestType, ResponseType>(mutation);
};
