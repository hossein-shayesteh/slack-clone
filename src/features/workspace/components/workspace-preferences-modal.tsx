import { TrashIcon } from "lucide-react";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";
import { useWorkspacePreferencesModal } from "@/src/features/workspace/store/use-workspace-preferences-modal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

const WorkspacePreferencesModal = () => {
  const [open, setOpen] = useWorkspacePreferencesModal();

  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspace(workspaceId);

  const handleModalClose = () => {
    setOpen(false);
  };

  if (!workspaceLoading)
    return (
      <Dialog open={open} onOpenChange={handleModalClose}>
        <DialogContent className={"overflow-hidden bg-gray-50 p-0"}>
          <DialogHeader className={"border-b bg-white p-4"}>
            <DialogTitle>Edit workspace</DialogTitle>
          </DialogHeader>
          <div className={"flex flex-col gap-y-2 px-4 pb-4"}>
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
            <div>
              <button
                disabled={false}
                onClick={() => {}}
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
    );
};
export default WorkspacePreferencesModal;
