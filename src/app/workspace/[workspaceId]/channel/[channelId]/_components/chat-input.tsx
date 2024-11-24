"use client";

import { useRef } from "react";

import dynamic from "next/dynamic";

import Quill from "quill";

const Editor = dynamic(() => import("@/src/components/shared/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder?: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="w-full px-5">
      <Editor
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default ChatInput;
