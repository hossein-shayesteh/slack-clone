import { ChangeEvent, useState } from "react";

import { useToast } from "@/src/hooks/use-toast";

import { useCreateChannel } from "@/src/features/channels/api/use-create-channel";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

const CreateChannelModal = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateChannelModal();

  const { toast } = useToast();

  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateChannel();

  const handleModalClose = () => {
    setOpen(false);
    setName("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = async () => {
    await mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast({ description: "Channel created." });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className={"space-y-4"} action={handleSubmit}>
          <Input
            required
            autoFocus
            value={name}
            minLength={3}
            maxLength={80}
            disabled={isPending}
            onChange={handleChange}
            placeholder={"e.g. plan-budget"}
          />
          <div className={"flex justify-end"}>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateChannelModal;