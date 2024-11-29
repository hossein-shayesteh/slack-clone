import dynamic from "next/dynamic";

import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

import { formatFullTime } from "@/src/lib/utils";

import { SingleMessageType } from "@/src/features/messages/api/use-get-messages";

import Hint from "@/src/components/shared/hint";
import Thumbnail from "@/src/components/shared/thumbnail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

const Renderer = dynamic(() => import("@/src/components/shared/renderer"), {
  ssr: false,
});

interface MessageProps {
  message: SingleMessageType;
  isAuthor: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
}

const Message = ({
  isCompact,
  message: {
    body,
    _creationTime,
    updatedAt,
    user: { image, name },
  },
}: MessageProps) => {
  const avatarFallback = name!.charAt(0).toUpperCase();

  if (isCompact)
    return (
      <div
        className={
          "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-300/60"
        }
      >
        <div className={"flex items-start gap-2"}>
          <Hint label={formatFullTime(new Date(_creationTime))}>
            <button
              className={
                "w-10 text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100"
              }
            >
              {format(new Date(_creationTime), "hh:mm")}
            </button>
          </Hint>
          <div className={"flex w-full flex-col"}>
            <Renderer value={body} />
            {updatedAt && (
              <span className={"text-xs text-muted-foreground"}>(edited)</span>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={
        "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-300/60"
      }
    >
      <div className={"flex items-start gap-2"}>
        <button>
          <Avatar className={"rounded-md"}>
            <AvatarImage className={"rounded-md"} src={image} alt={name} />
            <AvatarFallback
              className={"rounded-md bg-sky-500 text-sm text-white"}
            >
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className={"flex w-full flex-col overflow-hidden"}>
          <div className={"text-sm"}>
            <button
              onClick={() => {}}
              className={"font-bold text-primary hover:underline"}
            >
              {name}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(_creationTime))}>
              <button
                className={"text-xs text-muted-foreground hover:underline"}
              >
                {format(_creationTime, "h:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image} />
          {updatedAt && (
            <span className={"text-xs text-muted-foreground"}>(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
