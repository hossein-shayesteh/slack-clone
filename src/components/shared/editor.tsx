import {
  ElementRef,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { ImageIcon, Smile, XIcon } from "lucide-react";
import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";

import { cn } from "@/src/lib/utils";

import EmojiPopover, { BaseEmoji } from "@/src/components/shared/emoji-popover";
import Hint from "@/src/components/shared/hint";
import { Button } from "@/src/components/ui/button";

import { EditorValue } from "@/src/app/workspace/[workspaceId]/channel/[channelId]/_components/chat-input";

interface EditorProps {
  disabled?: boolean;
  placeholder?: string;
  onCancel?: () => void;
  defaultValue?: Delta | Op[];
  variant?: "create" | "update";
  innerRef?: MutableRefObject<Quill | null>;
  onSubmit: ({ image, body }: EditorValue) => void;
}

const Editor = ({
  defaultValue = [],
  onCancel,
  onSubmit,
  innerRef,
  disabled = false,
  placeholder = "Write something...",
  variant = "create",
}: EditorProps) => {
  // States
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setToolbarVisible] = useState(false);

  // Refs
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<ElementRef<"div">>(null);
  const disabledRef = useRef(disabled);
  const imageRef = useRef<ElementRef<"input">>(null);

  // UseEffect
  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    disabledRef.current = disabled;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
  });
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quill.getText();
                const body = JSON.stringify(quill.getContents());
                const addedImage = imageRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                if (isEmpty) return;

                submitRef.current?.({ image: addedImage, body });
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => setText(quill.getText()));

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) container.innerHTML = "";
      if (innerRef) innerRef.current = null;
      if (quillRef.current) quillRef.current = null;
    };
  }, [innerRef]);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  const toggleToolbar = () => {
    setToolbarVisible((prevState) => !prevState);

    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) toolbarElement.classList.toggle("hidden");
  };

  const handleEmojiSelection = (emoji: BaseEmoji) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const handleSubmit = () => {
    onSubmit({
      image,
      body: JSON.stringify(quillRef.current?.getContents()),
    });
  };

  return (
    <div className={"flex flex-col"}>
      <input
        ref={imageRef}
        type={"file"}
        accept={"image/*"}
        className={"hidden"}
        onChange={(e) => setImage(e.target.files![0])}
      />
      <div
        className={
          "flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm"
        }
      >
        <div ref={containerRef} className={"ql-custom h-full"} />
        {!!image && (
          <div className={"p-2"}>
            <div
              className={
                "group/image relative flex size-[62px] items-center justify-center"
              }
            >
              <Hint label={"Remove image"}>
                <button
                  className={
                    "absolute -right-2.5 -top-2.5 z-[4] hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white hover:bg-black group-hover/image:flex"
                  }
                  onClick={() => {
                    setImage(null);
                    imageRef.current!.value = "";
                  }}
                >
                  <XIcon className={"size-3.5"} />
                </button>
              </Hint>
              <Image
                fill
                alt={"Uploaded image"}
                src={URL.createObjectURL(image)}
                className={"overflow-hidden rounded-md border object-cover"}
              />
            </div>
          </div>
        )}
        <div className={"z-[5] flex px-2 pb-2"}>
          <Hint label={isToolbarVisible ? "Hide formating" : "Show formating"}>
            <Button
              disabled={disabled}
              variant={"ghost"}
              size={"iconSm"}
              onClick={toggleToolbar}
            >
              <PiTextAa className={"size-4"} />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={handleEmojiSelection}>
            <Button disabled={disabled} variant={"ghost"} size={"iconSm"}>
              <Smile className={"size-4"} />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label={"Image"}>
              <Button
                disabled={disabled}
                variant={"ghost"}
                size={"iconSm"}
                onClick={() => imageRef.current?.click()}
              >
                <ImageIcon className={"size-4"} />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className={"ml-auto flex items-center gap-x-2"}>
              <Button
                disabled={disabled}
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                size={"sm"}
                onClick={handleSubmit}
                className={"bg-[#007a5a] text-white hover:bg-[#007a5a]/80"}
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              size={"iconSm"}
              onClick={handleSubmit}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white text-muted-foreground hover:bg-white"
                  : "bg-[#007a5a] text-white hover:bg-[#007a5a]/80",
              )}
            >
              <MdSend className={"size-4"} />
            </Button>
          )}
        </div>
        {variant === "create" && (
          <div
            className={cn(
              "transitions flex justify-end p-2 text-[10px] text-muted-foreground opacity-0",
              isEmpty && "opacity-100",
            )}
          >
            <p>
              <strong>Shift + Return</strong> to add a new line.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
