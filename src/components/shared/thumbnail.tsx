import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface ThumbnailProps {
  url?: string;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={
            "relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border"
          }
        >
          <Image
            fill
            src={url}
            alt={"Message image"}
            className={"size-full rounded-md object-cover"}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className={"max-w-[800px] border-none bg-transparent p-0 shadow-none"}
      >
        <Image
          fill
          src={url}
          alt={"Message image"}
          className={"size-full rounded-md object-cover"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
