"use client";

import { useRef, useState } from "react";

import dynamic from "next/dynamic";

import { Id } from "@/convex/_generated/dataModel";
import Quill from "quill";

import { useToast } from "@/src/hooks/use-toast";

import { useChannelId } from "@/src/features/channels/hooks/use-channel-id";
import { useCreateMessage } from "@/src/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/src/features/upload/api/use-generate-upload-url";
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

interface CreateMessageValues {
  body: string;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage">;
  channelId?: Id<"channels">;
  parentMessage?: Id<"messages">;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [url, setUrl] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { toast } = useToast();

  const handleSubmit = async ({ image, body }: EditorValue) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        channelId,
      };

      if (image) {
        await generateUploadUrl(undefined, {
          onSuccess: (data) => setUrl(data),
          throwError: true,
        });

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) throw new Error("Failed to upload image.");

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      // Reset the states of Editor component
      setEditorKey((prevState) => prevState + 1);
    } catch {
      toast({ description: "Failed to send message." });
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
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
