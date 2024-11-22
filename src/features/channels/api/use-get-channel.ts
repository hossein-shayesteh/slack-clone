"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetChannel = (id: Id<"channels">) => {
  const data = useQuery(api.channels.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
