import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generatedCode = () => {
  return Array.from(
    { length: 6 },
    () =>
      "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)],
  ).join("");
};

export const populateUser = async ({
  ctx,
  userId,
}: {
  ctx: QueryCtx;
  userId: Id<"users">;
}) => {
  return ctx.db.get(userId);
};

export const authorizeAdmin = async ({
  ctx,
  workspaceId,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
}) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");

  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
  if (!member || member.role !== "admin") throw new Error("Unauthorized");

  return member;
};

export const isUserMemberOfWorkspace = async ({
  workspaceId,
  ctx,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
}) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  const member = await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
  if (!member) return null;

  return member;
};
