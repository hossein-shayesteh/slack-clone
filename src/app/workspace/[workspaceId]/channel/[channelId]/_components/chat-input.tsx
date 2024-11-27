"use client";

import { useCallback, useRef } from "react";

import dynamic from "next/dynamic";

import Quill from "quill";

const Editor = dynamic(() => import("@/src/components/shared/editor"), {
  ssr: false,
});
export interface EditorValue {
  body: string;
  image: File | null;
}

interface ChatInputProps {
  placeholder?: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = ({ image, body }: EditorValue) => {
    console.log(image, body);
  };

  return (
    <div className="w-full px-5">
      <Editor
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatInput;
