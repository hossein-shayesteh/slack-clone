"use client";

import { useRef, useState } from "react";

import dynamic from "next/dynamic";

import Quill from "quill";

import { useToast } from "@/src/hooks/use-toast";

import { useChannelId } from "@/src/features/channels/hooks/use-channel-id";
import { useCreateMessage } from "@/src/features/messages/api/use-create-message";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

const Editor = dynamic(() => import("@/src/components/shared/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder?: string;
}

export interface EditorValue {
  body: string;
  image: File | null;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();

  const { toast } = useToast();

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);

      await createMessage(
        { body, workspaceId, channelId },
        { throwError: true },
      );

      // Reset the states of Editor component
      setEditorKey((prevState) => prevState + 1);
    } catch {
      toast({ description: "Failed to send message." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        innerRef={editorRef}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={isPending}
      />
    </div>
  );
};

export default ChatInput;
