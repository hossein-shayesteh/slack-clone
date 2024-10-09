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
  const [open, setOpen] = useCreateWorkspaceModal();

  const handleModalClose = () => {
    setOpen(false);
    // TODO: clear form
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className={"space-y-4"}>
          <Input
            required
            autoFocus
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
