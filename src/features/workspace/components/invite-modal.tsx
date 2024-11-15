import { CopyIcon } from "lucide-react";

import { useToast } from "@/src/hooks/use-toast";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";
import { useInviteModal } from "@/src/features/workspace/store/use-invite-modal";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

const InviteModal = () => {
  const [open, setOpen] = useInviteModal();

  const { toast } = useToast();

  const workspaceId = useWorkspaceId();
  const { data: workspace } = useGetWorkspace(workspaceId);

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspace?._id}`;

    navigator.clipboard.writeText(inviteLink).then(() =>
      toast({
        description: "Invite link copied to clipboard.",
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={"overflow-hidden bg-gray-50 p-0"}>
        <DialogHeader className={"border-b bg-white p-4"}>
          <DialogTitle>Invite people to {workspace?.name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div
          className={"flex flex-col items-center justify-center gap-y-4 py-10"}
        >
          <p className={"text-4xl font-bold uppercase tracking-widest"}>
            {workspace?.joinCode}
          </p>
          <Button size={"sm"} variant={"ghost"} onClick={handleCopy}>
            Copy link
            <CopyIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteModal;
