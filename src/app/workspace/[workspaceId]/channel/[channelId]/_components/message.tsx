import { Id } from "@/convex/_generated/dataModel";

import { SingleMessageType } from "@/src/features/messages/api/use-get-messages";

interface MessageProps {
  message: SingleMessageType;
  isAuthor: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
}

const Message = ({}: MessageProps) => {
  return <div></div>;
};

export default Message;
