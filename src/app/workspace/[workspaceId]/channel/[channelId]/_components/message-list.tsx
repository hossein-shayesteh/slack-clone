import { differenceInMinutes, format } from "date-fns";

import { formatDateLabel } from "@/src/lib/utils";

import { GetMessagesReturnType } from "@/src/features/messages/api/use-get-messages";

import Message from "@/src/app/workspace/[workspaceId]/channel/[channelId]/_components/message";

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "conversation" | "thread";
  messages: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const TIME_THRESHOLD = 5;

const MessageList = ({
  canLoadMore,
  channelCreationTime,
  channelName,
  isLoadingMore,
  loadMore,
  memberImage,
  memberName,
  messages,
  variant = "channel",
}: MessageListProps) => {
  const groupedMessages = messages?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof messages>,
  );
  return (
    <div className={"flex flex-1 flex-col-reverse overflow-y-auto pb-4"}>
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className={"relative my-2 text-center"}>
            <hr
              className={
                "absolute left-0 right-0 top-1/2 border-t border-gray-300"
              }
            />
            <span
              className={
                "relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm"
              }
            >
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1];

            const inCompact =
              previousMessage &&
              previousMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(previousMessage._creationTime),
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message._id}
                message={message}
                isAuthor={false}
                isCompact={inCompact}
                setEditingId={() => {}}
                hideThreadButton={false}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
