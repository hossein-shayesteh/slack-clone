"use client";

import { useCallback, useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

type ResponseType = Doc<"workspaces"> | null;
type RequestType = { id: Id<"workspaces"> };

interface Options {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  throwError?: boolean;
}

export const useRemoveWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const mutation = useMutation(api.workspaces.remove);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      setError(null);
      setData(null);
      setStatus(() => "pending");

      try {
        const response = await mutation(values);
        setData(response);
        setStatus(() => "success");
        options?.onSuccess?.(response);
      } catch (error) {
        setStatus(() => "error");
        setError(error as Error);
        options?.onError?.(error as Error);
        if (options?.throwError) throw error;
      } finally {
        options?.onComplete?.();
      }
    },
    [mutation],
  );

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  return { mutate, data, error, isPending, isSuccess, isError };
};
