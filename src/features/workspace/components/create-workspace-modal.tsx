import { ElementRef, useRef } from "react";

import { useRouter } from "next/navigation";

import { useToast } from "@/src/hooks/use-toast";

import { useCreateWorkspaces } from "@/src/features/workspace/api/use-create-workspaces";
import { useCreateWorkspaceModal } from "@/src/features/workspace/store/use-create-workspace-modal";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

const CreateWorkspaceModal = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();

  const { toast } = useToast();
  const { mutate } = useCreateWorkspaces();

  const handleModalClose = () => {
    setOpen(false);
    formRef?.current?.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;

    await mutate(
      { name },
      {
        onSuccess: (data) => {
          setOpen(false);
          toast({ description: "Workspace created." });
          router.push(`/workspace/${data!._id}`);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className={"space-y-4"} action={handleSubmit} ref={formRef}>
          <Input
            required
            autoFocus
            name={"name"}
            minLength={3}
            disabled={false}
            placeholder={"Workspace name r.g. 'work', 'Personal', 'Home'"}
          />
          <div className={"flex justify-end"}>
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateWorkspaceModal;
