import { useCallback, useMemo, useState } from "react";

interface Options<ResponseType> {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  throwError?: boolean;
}

type MutationFunction<RequestType, ResponseType> = (
  values: RequestType,
) => Promise<ResponseType>;

export const useConvexMutation = <RequestType, ResponseType>(
  mutationFunc: MutationFunction<RequestType, ResponseType>,
) => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const mutate = useCallback(
    async (values: RequestType, options?: Options<ResponseType>) => {
      setError(null);
      setData(null);
      setStatus("pending");

      try {
        const response = await mutationFunc(values);
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);
      } catch (error) {
        setStatus("error");
        setError(error as Error);
        options?.onError?.(error as Error);
        if (options?.throwError) throw error;
      } finally {
        options?.onComplete?.();
      }
    },
    [mutationFunc],
  );

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);

  return { mutate, data, error, isPending, isSuccess, isError };
};
