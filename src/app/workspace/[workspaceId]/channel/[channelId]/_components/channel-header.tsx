import React, { ChangeEvent, useState } from "react";

import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import useConfirm from "@/src/hooks/use-confirm";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

interface ChannelHeaderProps {
  title: string;
}

const ChannelHeader = ({ title }: ChannelHeaderProps) => {
  const [name, setName] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const [ConfirmDialog] = useConfirm({
    title: "Are you sure?",
    message: "This action in irreversible.",
  });

  const handleModalClose = () => {
    setEditOpen(false);
    setName("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <ConfirmDialog />
      <div
        className={
          "flex h-[49px] items-center overflow-hidden border-b bg-white px-4"
        }
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className={"w-auto overflow-hidden px-2 text-lg font-semibold"}
              size={"sm"}
            >
              <span className={"truncate"}># {title}</span>
              <FaChevronDown className={"ml-2 size-2.5"} />
            </Button>
          </DialogTrigger>
          <DialogContent className={"overflow-hidden bg-gray-50 p-0"}>
            <DialogHeader className={"border-b bg-white p-4"}>
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className={"flex flex-col gap-y-2 px-4 pb-4"}>
              <Dialog open={editOpen} onOpenChange={handleModalClose}>
                <DialogTrigger asChild>
                  <div
                    className={
                      "cursor-pointer rounded-lg border bg-white px-5 py-4 transition hover:bg-gray-50"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <p className={"text-sm font-semibold"}>Channel name</p>
                      <p
                        className={
                          "text-sm font-semibold text-[#1264a3] hover:underline"
                        }
                      >
                        Edit
                      </p>
                    </div>
                    <p className={"text-sm text-muted-foreground"}># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form className={"space-y-4"} onSubmit={handleSubmit}>
                    <Input
                      required
                      autoFocus
                      value={name}
                      minLength={3}
                      maxLength={80}
                      disabled={false}
                      onChange={handleChange}
                      placeholder={"e.g. plan-budget"}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"outline"} disabled={false}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={false}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <div>
                <button
                  disabled={false}
                  onClick={() => {}}
                  className={
                    "flex w-full cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 transition hover:bg-gray-50"
                  }
                >
                  <TrashIcon className={"size-4"} />
                  <p className={"text-sm font-semibold"}>Delete channel</p>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
export default ChannelHeader;
