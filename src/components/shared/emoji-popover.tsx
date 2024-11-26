import React, { useState } from "react";

import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

export interface BaseEmoji {
  id: string;
  name: string;
  colons: string;
  emoticons: string[];
  unified: string;
  skin: 1 | 2 | 3 | 4 | 5 | 6 | null;
  native: string;
}

interface EmojiPickerProps {
  hint?: string;
  children: React.ReactNode;
  onEmojiSelect?: (emoji: BaseEmoji) => void;
}

const EmojiPopover = ({
  children,
  onEmojiSelect,
  hint = "Emoji",
}: EmojiPickerProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: BaseEmoji) => {
    onEmojiSelect?.(emoji);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          delayDuration={50}
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent
            className={"border border-white/5 bg-black text-white"}
          >
            <p className={"text-xs font-medium"}>{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className={"w-full border-none p-0 shadow-none"}>
          <EmojiPicker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
