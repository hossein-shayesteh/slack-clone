"use client";

import { AlertTriangle, Loader } from "lucide-react";

import { useGetChannel } from "@/src/features/channels/api/use-get-channel";
import { useChannelId } from "@/src/features/channels/hooks/use-channel-id";
import { useGetMessages } from "@/src/features/messages/api/use-get-messages";

import ChannelHeader from "@/src/app/workspace/[workspaceId]/channel/[channelId]/_components/channel-header";
import ChatInput from "@/src/app/workspace/[workspaceId]/channel/[channelId]/_components/chat-input";
import MessageList from "@/src/app/workspace/[workspaceId]/channel/[channelId]/_components/message-list";

const ChannelId = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelIsLoading } =
    useGetChannel(channelId);
  const { data: messages, status, loadMore } = useGetMessages({ channelId });

  if (channelIsLoading || status === "LoadingFirstPage")
    return (
      <div className={"h-full flex-1 flex-col items-center justify-center"}>
        <Loader className={"size-5 animate-spin text-muted-foreground"} />
      </div>
    );

  if (!channel)
    return (
      <div
        className={"h-full flex-1 flex-col items-center justify-center gap-y-2"}
      >
        <AlertTriangle className={"size-5 text-muted-foreground"} />
        <span className={"text-sm text-muted-foreground"}>
          Channel not found.
        </span>
      </div>
    );

  return (
    <div className={"flex h-full flex-col"}>
      <ChannelHeader title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        loadMore={loadMore}
        messages={messages}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};
export default ChannelId;
