"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType.page;
export type SingleMessageType = GetMessagesReturnType[number];

const BATCH_SIZE = 20;

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE },
  );
  const isLoading = results === undefined;

  return {
    data: results,
    status,
    isLoading,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
