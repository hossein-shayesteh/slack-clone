import { CopyIcon, RefreshCcw } from "lucide-react";

import useConfirm from "@/src/hooks/use-confirm";
import { useToast } from "@/src/hooks/use-toast";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useUpdateJoinCode } from "@/src/features/workspace/api/use-update-join-code";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";
import { useInviteModal } from "@/src/features/workspace/store/use-invite-modal";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

const InviteModal = () => {
  const [open, setOpen] = useInviteModal();

  const workspaceId = useWorkspaceId();

  const { data: workspace } = useGetWorkspace(workspaceId);

  const { mutate: updateJoinCode, isPending: updateJoinCodeIsPending } =
    useUpdateJoinCode();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message:
      "This will deactivate the current invite code and generate new one.",
  });

  const { toast } = useToast();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspace?._id}`;

    navigator.clipboard.writeText(inviteLink).then(() =>
      toast({
        description: "Invite link copied to clipboard.",
      }),
    );
  };

  const handleUpdateJoinCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    await updateJoinCode(
      { id: workspaceId },
      {
        onSuccess: () =>
          toast({
            description: "Invite link updated.",
          }),
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={"overflow-hidden bg-gray-50 p-0"}>
          <DialogHeader className={"border-b bg-white p-4"}>
            <DialogTitle>Invite people to {workspace?.name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div
            className={
              "flex flex-col items-center justify-center gap-y-4 py-10"
            }
          >
            <p className={"text-4xl font-bold uppercase tracking-widest"}>
              {workspace?.joinCode}
            </p>
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={handleCopy}
              disabled={updateJoinCodeIsPending}
            >
              Copy link
              <CopyIcon />
            </Button>
          </div>
          <div className={"flex w-full items-center justify-center"}>
            <Button
              variant={"outline"}
              onClick={handleUpdateJoinCode}
              disabled={updateJoinCodeIsPending}
            >
              New code
              <RefreshCcw className={"ml-2 size-4"} />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default InviteModal;
