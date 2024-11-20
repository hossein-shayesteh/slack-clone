import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const authorizeAdmin = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
) => {
  const userId = await getAuthUserId(ctx);

  if (!userId) throw new Error("Unauthorized");

  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();

  if (!member || member.role !== "admin") throw new Error("Unauthorized");

  return userId;
};
