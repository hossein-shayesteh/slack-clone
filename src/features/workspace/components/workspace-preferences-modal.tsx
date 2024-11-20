import { ElementRef, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { TrashIcon } from "lucide-react";

import useConfirm from "@/src/hooks/use-confirm";
import { useToast } from "@/src/hooks/use-toast";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useRemoveWorkspace } from "@/src/features/workspace/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/src/features/workspace/api/use-update-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";
import { useWorkspacePreferencesModal } from "@/src/features/workspace/store/use-workspace-preferences-modal";

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

const WorkspacePreferencesModal = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useWorkspacePreferencesModal();

  const formRef = useRef<ElementRef<"form">>(null);

  const router = useRouter();

  const { toast } = useToast();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This action in irreversible.",
  });

  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspace(workspaceId);
  const { mutate: updateWorkspace, isPending: isUpdatingPending } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingPending } =
    useRemoveWorkspace();

  const handleRenameModalClose = () => {
    formRef?.current?.reset();
    setEditOpen(false);
  };

  const handleRemoveWorkspace = async () => {
    const ok = await confirm();
    if (!ok) return;

    await removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast({
            description: "Workspace removed.",
          });
          router.replace(`/`);
        },
        onError: () => {
          toast({
            description: "Failed to remove workspace.",
          });
        },
      },
    );
  };

  const handleWorkspaceUpdate = async (formData: FormData) => {
    const name = formData.get("name") as string;

    await updateWorkspace(
      { name, id: workspaceId },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast({
            description: "Workspace updated.",
          });
        },
        onError: () => {
          toast({
            description: "Failed to update workspace.",
          });
        },
      },
    );
  };

  if (!workspaceLoading)
    return (
      <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className={"overflow-hidden bg-gray-50 p-0"}>
            <DialogHeader className={"border-b bg-white p-4"}>
              <DialogTitle>Edit workspace</DialogTitle>
            </DialogHeader>
            <div className={"flex flex-col gap-y-2 px-4 pb-4"}>
              <Dialog open={editOpen} onOpenChange={handleRenameModalClose}>
                <DialogTrigger asChild>
                  <div
                    className={
                      "cursor-pointer rounded-lg border bg-white px-5 py-4 transition hover:bg-gray-50"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <p className={"text-sm font-semibold"}>Workspace name</p>
                      <p
                        className={
                          "text-sm font-semibold text-[#1264a3] hover:underline"
                        }
                      >
                        Edit
                      </p>
                    </div>
                    <p className={"text-sm text-muted-foreground"}>
                      {workspace?.name}
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this workspace</DialogTitle>
                  </DialogHeader>
                  <form
                    ref={formRef}
                    className={"space-y-4"}
                    action={handleWorkspaceUpdate}
                  >
                    <input
                      required
                      autoFocus
                      name={"name"}
                      minLength={3}
                      placeholder={
                        "Workspace name r.g. 'work', 'Personal', 'Home'"
                      }
                      disabled={isUpdatingPending}
                      defaultValue={workspace?.name}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant={"outline"}
                          disabled={isUpdatingPending}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingPending}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <div>
                <button
                  disabled={isRemovingPending}
                  onClick={handleRemoveWorkspace}
                  className={
                    "flex w-full cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 transition hover:bg-gray-50"
                  }
                >
                  <TrashIcon className={"size-4"} />
                  <p className={"text-sm font-semibold"}>Delete workspace</p>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
};
export default WorkspacePreferencesModal;
